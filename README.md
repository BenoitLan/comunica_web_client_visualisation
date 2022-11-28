# comunica_web_client_visualisation

Creating an visualisation extension for the existing Comunica Web Client

Link: https://query.linkeddatafragments.org/ 

Github: https://github.com/comunica/jQuery-Widget.js

to run go into the file 'jQuery-Widget extension'

in terminal enter:

*yarn install*

and then then 

*yarn run dev*



- - - - - - - - - - - - - - - - - - - - - - -

Changed files:

jQuery-Widget extension/src/ldf-client-ui.js 

jQuery-Widget extension/src/ldf-client-worker.js

jQuery-Widget extension/styles/ldf-client.css

jQuery-Widget extension/index.html

- - - - - - - - - - - - - - - - - - - - - - -

We add all the necessary data to the variable *allMermaidInput*.

All the data will be appended to this variable with the button "execute query" and visualized with the button "get query plan"

An example of how the data of *allMermaidInput* could look like:

allMermaidInput:  flowchart TB

subgraph sources

id1{{sources}}-->http://fragments.dbpedia.org/2016-04/en

id1{{sources}}-->https://ruben.verborgh.org/profile/

id1{{sources}}-->https://www.rubensworks.net/

http://fragments.dbpedia.org/2016-04/en & https://ruben.verborgh.org/profile/ & https://www.rubensworks.net/

style sources fill:#f44336,stroke:#333,stroke-width:4px

end

sources-->|results|result0

subgraph result0

row0(?name)-->row0h(&#34Terry Gilliam&#34&#64en)

row1(?title)-->row1h(&#3412 Monkeys&#34&#64en)

row2(?movie)-->row2h(http://dbpedia.org/resource/12_Monkeys)

style result0 fill:#eeeeee,stroke:#333,stroke-width:2px

end
