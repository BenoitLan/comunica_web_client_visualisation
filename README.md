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

All the data will be appended to this variable with the button *execute query* and visualized with the button *get query plan*

An example of how the data of *allMermaidInput* could look like:

        flowchart TB
        subgraph sources
        id1{{sources}}-->http://fragments.dbpedia.org/2016-04/en
        id1{{sources}}-->https://ruben.verborgh.org/profile/
        id1{{sources}}-->https://www.rubensworks.net/
        http://fragments.dbpedia.org/2016-04/en & https://ruben.verborgh.org/profile/ & https://www.rubensworks.net/
        style sources fill:#f44336,stroke:#333,stroke-width:4px
        end
        sources-->|results|result0
        subgraph result0
        row0(?name)-->row0h("Terry Gilliam"@en)
        row1(?title)-->row1h("12 Monkeys"@en)
        row2(?movie)-->row2h(http://dbpedia.org/resource/12_Monkeys)
        style result0 fill:#eeeeee,stroke:#333,stroke-width:2px
        end
        result0-->result1
        subgraph result1
        row3(?name)-->row3h("Robert Redford"@en)
        row4(?title)-->row4h("A River Runs Through It (film)"@en)
        row5(?movie)-->row5h(http://dbpedia.org/resource/A_River_Runs_Through_It_(film))
        style result1 fill:#eeeeee,stroke:#333,stroke-width:2px
        end

But there are some illegal characters in mermaid-js so we use the unicode code for it:

" is &#34

@ is &#64

( is &#40

) is &#41

which generates next graph:

![image](https://user-images.githubusercontent.com/109519721/204300055-1d46bbc7-95ff-47ac-a4fa-50290e407801.png)

I have also added a subgraph to every match with what happend before getting a match:

![image](https://user-images.githubusercontent.com/109519721/204369260-3559cbc0-f021-406d-a70e-f0c4e5f7efce.png)

This can be used and expanded later on



