var engine = null;
var RdfString = require('rdf-string');
var LoggerPretty = require('@comunica/logger-pretty').LoggerPretty;
var bindingsStreamToGraphQl = require('@comunica/actor-query-result-serialize-tree').bindingsStreamToGraphQl;
var ProxyHandlerStatic = require('@comunica/actor-http-proxy').ProxyHandlerStatic;
var WorkerToWindowHandler = require('@rubensworks/solid-client-authn-browser').WorkerToWindowHandler;
var QueryEngineBase = require('@comunica/actor-init-query').QueryEngineBase;

// The active fragments client and the current results
var resultsIterator;

let inputSources = ''; // added by Benoît, will have all the input sources, for example: Ruben Verborgh's profile and Ruben Taelman's profile. 

// Set up logging
var logger = new LoggerPretty({ level: 'info' });
logger.log = function (level, message, data) {
  postMessage({ type: 'log', log: message + (data ? (' ' + JSON.stringify(data)) : '') + '\n' });
};

// Handler for authenticating fetch requests within main window
const workerToWindowHandler = new WorkerToWindowHandler(self);

function initEngine(config) {
  // Create an engine lazily
  if (!engine)
    engine = new QueryEngineBase(require('my-comunica-engine'));

  // Set up a proxy handler
  if (config.context.httpProxy)
    config.context.httpProxyHandler = new ProxyHandlerStatic(config.context.httpProxy);

  // Set up authenticated fetch
  if (config.context.workerSolidAuth)
    config.context.fetch = workerToWindowHandler.buildAuthenticatedFetch();

  // Transform query format to expected structure
  if (config.context.queryFormat)
    config.context.queryFormat = { language: config.context.queryFormat };
}

// Handlers of incoming messages
var handlers = {
  // Execute the given query with the given options
  query: function (config) {
    initEngine(config);

    // Create a client to fetch the fragments through HTTP
    config.context.log = logger;
    engine.query(config.query, config.context)
      .then(async function (result) {
        // Post query metadata
        postMessage({ type: 'queryInfo', queryType: result.resultType });

        var bindings = result.resultType === 'bindings';
        var resultsToTree = config.resultsToTree;
        switch (result.resultType) {
        case 'quads':
          resultsIterator = await result.execute();
          break;
        case 'bindings':
          resultsIterator = await result.execute();
          break;
        case 'boolean':
          result.execute().then(function (exists) {
            postMessage({ type: 'result', result: exists });
            postMessage({ type: 'end' });
          }).catch(postError);
          break;
        case 'void':
          result.execute().then(function () {
            postMessage({ type: 'result', result: 'Done' });
            postMessage({ type: 'end' });
          }).catch(postError);
          break;
        }
        console.log("config.context: ", config.context);
        for (let i = 0 ; i < config.context["@comunica/bus-rdf-resolve-quad-pattern:sources"].length ; i++){
          console.log(config.context["@comunica/bus-rdf-resolve-quad-pattern:sources"][i]["value"]); // displays the amount of input sources
          inputSources = config.context["@comunica/bus-rdf-resolve-quad-pattern:sources"][i]["value"];
          postMessage({ type: 'inputSources', inputSources: inputSources}); // added myself to add input sources! :) 
        }
        console.log("URL: ", config.context["@comunica/bus-rdf-resolve-quad-pattern:sources"]); // it starts from here I think!
        if (resultsIterator) {
          if (resultsToTree) {
            bindingsStreamToGraphQl(resultsIterator, result.context, { materializeRdfJsTerms: true })
              .then(function (results) {
                (Array.isArray(results) ? results : [results]).forEach(function (result) {
                  postMessage({ type: 'result', result: { result: '\n' + JSON.stringify(result, null, '  ') } });
                });
                postMessage({ type: 'end' });
              })
              .catch(postError);
          }
          else {
            resultsIterator.on('data', function (result) {
              if (bindings)
                result = Object.fromEntries([...result].map(([key, value]) => [RdfString.termToString(key), RdfString.termToString(value)]));
              else
                result = RdfString.quadToStringQuad(result);
              postMessage({ type: 'result', result: result });
            });
            resultsIterator.on('end', function () {
              postMessage({ type: 'end' });
            });
            resultsIterator.on('error', postError);
          }
        }
      }).catch(postError);
  },

  // Stop the execution of the current query
  stop: function () {
    if (resultsIterator) {
      resultsIterator.destroy();
      resultsIterator = null;
    }
  },

  // Obtain the foaf:name of a WebID
  getWebIdName: function ({ webId, context }) {
    const config = {
      query: `
PREFIX foaf: <http://xmlns.com/foaf/0.1/>
SELECT ?name WHERE {
  <${webId}> foaf:name ?name.
}`,
      context: {
        ...context,
        'sources': [webId],
        // TODO: this can be removed once this issue is fixed: https://github.com/comunica/comunica/issues/950
        '@comunica/actor-rdf-resolve-hypermedia-links-traverse:traverse': false,
      },
    };
    initEngine(config);
    config.context.log = logger;
    engine.queryBindings(config.query, config.context)
      .then(function (result) {
        result.toArray({ limit: 1 })
          .then(bindings => {
            if (bindings.length > 0)
              postMessage({ type: 'webIdName', name: bindings[0].get('name').value });

            // Clear HTTP cache to make sure we re-fetch all next URL
            // TODO: this can be removed once this issue is fixed: https://github.com/comunica/comunica/issues/950
            engine.invalidateHttpCache();
          }).catch(postError);
      }).catch(postError);
  },
};

function postError(error) {
  error = { message: error.message || error.toString() };
  postMessage({ type: 'error', error: error });
}

// Send incoming message to the appropriate handler
self.onmessage = function (m) {
  if (workerToWindowHandler.onmessage(m))
    return;
  handlers[m.data.type](m.data);
};

// export default inputSources;