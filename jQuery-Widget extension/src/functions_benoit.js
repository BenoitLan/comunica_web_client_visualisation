let inputSources = ''; // added by Benoît, will have all the input sources, for example: Ruben Verborgh's profile and Ruben Taelman's profile. 

export function input_sources(config_text){
    console.log("config.context: ", config_text);
    for (let i = 0 ; i < config_text["@comunica/bus-rdf-resolve-quad-pattern:sources"].length ; i++){
        console.log(config_text["@comunica/bus-rdf-resolve-quad-pattern:sources"][i]["value"]); // displays the amount of input sources
        inputSources = config_text["@comunica/bus-rdf-resolve-quad-pattern:sources"][i]["value"];
        postMessage({ type: 'inputSources', inputSources: inputSources}); // added myself to add input sources! :) 
    }
    console.log("URL: ", config_text["@comunica/bus-rdf-resolve-quad-pattern:sources"]); // it starts from here I think!
}

let allMermaidInput = 'flowchart TB\n'; // added myself, Benoît
let requestlogCat = ''; // added myself, Benoît
let lastlogELement = ''; // added myself, Benoît
let mermaidInputSources = ''; // added myself, Benoît
let mermaidInputSourcesArray = []; // added myself, Benoît
let mermaidData = '';
let mermaidDataIndex = 0;
let mermaidDataSubgraphIndex = 0;
let lastlog = '';

export async function _startExecutionPlan() { // added, self made
    allMermaidInput += 'subgraph sources\n'
    allMermaidInput += mermaidInputSources // add sources to all the mermaid input
    if (mermaidInputSourcesArray.length > 1){ // if multiple sources are used all will visible in one block
        let i = 0;
        for (i = 0 ; i < mermaidInputSourcesArray.length-1 ; i++){
        allMermaidInput += mermaidInputSourcesArray[i];
        allMermaidInput += ' & ';
        }
        allMermaidInput += mermaidInputSourcesArray[i];
        allMermaidInput += '\n';
    } else {
        allMermaidInput += '\n'
    }
    allMermaidInput += 'style sources fill:#f44336,stroke:#333,stroke-width:4px\n'

    allMermaidInput += 'end\n';
    allMermaidInput += 'sources-->|results|result0\n';

    console.log("starting execution plan...");

    console.log("mermaidData: \n", mermaidData)

    allMermaidInput += mermaidData; // append all the subgraph data logs
    console.log("allMermaidInput: ", allMermaidInput);








    var element = document.querySelector(".mermaid");

    var insertSvg = function(svgCode, bindFunctions) {
        element.innerHTML = svgCode;
    };

    var graph = mermaid.render("graphDiv", allMermaidInput, insertSvg);
}


export function _getLogData(log){ 
    // console.log("LOG: \n", log);
    lastlog += log;
    lastlog += '\n';
    if (log.includes('Requesting')){

    }
}

export function _getResultData(result_){
    if (mermaidDataSubgraphIndex != 0){ // for the first result, so that next results will connect correctly according to the mermaid-js syntax
        mermaidData += 'result' + (mermaidDataSubgraphIndex-1) + '-->' + 'result' + mermaidDataSubgraphIndex+'\n';
    }
    console.log("last log: ", lastlog);
    mermaidData += 'subgraph result' + mermaidDataSubgraphIndex + '\n'
    for (const [key, value] of Object.entries(result_)) {
        let valuerep = value.replace(/\"/g, "&#34");// MERMAID DOESN'T ACCEPT " BUT solvable with unicode! :)
        valuerep = valuerep.replace(/\@/g, "&#64"); // MERMAID DOESN'T ACCEPT @ BUT solvable with unicode! :)
        valuerep = valuerep.replace(/\(/g, "&#40"); // MERMAID DOESN'T ACCEPT ( BUT solvable with unicode! :)
        valuerep = valuerep.replace(/\)/g, "&#41"); // MERMAID DOESN'T ACCEPT ) BUT solvable with unicode! :)
        console.log(`${key}: ${valuerep}`);
        mermaidData += 'row' + mermaidDataIndex + '(' + `${key})` + '-->' + 'row' + mermaidDataIndex + 'h(' + `${valuerep}` + ')\n';
        mermaidDataIndex += 1;
    }
    mermaidData += 'style ' + 'result' + mermaidDataSubgraphIndex + ' fill:#eeeeee,stroke:#333,stroke-width:2px\n'
    mermaidData += 'end\n'
    mermaidDataSubgraphIndex += 1;
    lastlog = ''; // delete last log before result
}

export function _getInputSources(inputSources_){ // for example inputsources RubenTaelman and RubenVerborgh
    console.log("inputSources_: ", inputSources_);
    mermaidInputSources += "id1{{sources}}-->";
    mermaidInputSources += inputSources_;
    mermaidInputSources += '\n';
    mermaidInputSourcesArray.push(inputSources_);
}