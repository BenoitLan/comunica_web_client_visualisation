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

// const requestlog = []; // SELF MADE!!! -> Benoît // not used anymore, we need to concat strings to each other to use it in Mermaid-JS
let allMermaidInput = 'flowchart TB\n'; // added myself, Benoît
let requestlogCat = ''; // added myself, Benoît
let lastlogELement = ''; // added myself, Benoît
let mermaidInputSources = ''; // added myself, Benoît
let mermaidInputSourcesArray = []; // added myself, Benoît
let mermaidData = '';
let mermaidDataIndex = 0
let mermaidDataSubgraphIndex = 0

export async function _startExecutionPlan() { // added, self made
    allMermaidInput += 'subgraph sources\n'
    allMermaidInput += mermaidInputSources // add sources to all the mermaid input
    if (mermaidInputSourcesArray.length > 1){ // if multiple sources are used all will direct to one block
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

    // mermaidInputSources += requestlogCat;
    console.log("starting execution plan...");
    // appended all the resources to allMermaidInput
    // continue appending to allMermaidInput :D -Benoît
    console.log("mermaidData: \n", mermaidData)

    allMermaidInput += mermaidData; // append all the subgraph data logs
    console.log("allMermaidInput: ", allMermaidInput);








    var element = document.querySelector(".mermaid");

    var insertSvg = function(svgCode, bindFunctions) {
        element.innerHTML = svgCode;
    };


    // requestlogCat += 'EndOfExecutionLog';

    var graph = mermaid.render("graphDiv", allMermaidInput, insertSvg);
}


export function _getLogData(log){ //  BE AWARE! MERMAID-JS DOESN'T ACCEPT THE SYMBOL '%'!!!!! SO I will temporarly use the string until the first '%' character // opgelost door bv id[.....]
    // console.log("AAAAAAAAAAAAAAA: ", log); // need to find a way
    console.log("LOG: \n", log);
    if (log.includes('Requesting')){
        // // console.log("BEVAT REQUESTING!!!!!!!!!!!!!@@@@@@@@@@@@@");/
        // let myregexp = new RegExp("Requesting (.+ ){");
        // // let myregexp = new RegExp("Requesting ([^?]*)"); // matches everything untill the symbol '?'
        // let mymatch = myregexp.exec(log);
        // mymatch[1] = mymatch[1].replace(/%/g, ""); // replacing '%' symbol by nothing because Mermaid-JS won't accept this. 
        // console.log("ok", mymatch[1]);
        // requestlogCat += mymatch[1];
        // requestlogCat += '-->|Request|';
        // lastlogELement = mymatch[1];
    }
}

export function _getResultData(result_){
    if (mermaidDataSubgraphIndex != 0){
        mermaidData += 'result' + (mermaidDataSubgraphIndex-1) +'-->' + 'result' + mermaidDataSubgraphIndex+'\n';
    }

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
}

export function _getInputSources(inputSources_){ // for example inputsources RubenTaelman and RubenVerborgh
    console.log("inputSources_: ", inputSources_);
    mermaidInputSources += "id1{{sources}}-->";
    mermaidInputSources += inputSources_;
    mermaidInputSources += '\n';
    mermaidInputSourcesArray.push(inputSources_);
}