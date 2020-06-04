
function init(){
    //grabs reference to the dropdown element
    var dropdown = d3.select("#selDataset");

    //populate list with sample names
    d3.json("samples.json").then((data) =>{
        var sampleNames = data.names;
        console.log(data)
        console.log(sampleNames)

        sampleNames.forEach((sample) => {
            dropdown
            .append("option")
            .text(sample)
            .property("value",sample);
        })
        var firstSample = sampleNames[0];
        buildCharts(firstSample);
        buildMetadata(firstSample);
    });
    
}

function optionChanged(newSample){
    //gets new data every time sample is selected
    buildMetadata(newSample);
    buildCharts(newSample);
}

function buildMetadata(sample){
    
    d3.json("samples.json").then((data) => {
        var metadata = data.metadata;

        var resultArray = metadata.filter(sampleObj => sampleObj.id ==sample);
        var result = resultArray[0];
        console.log(result)
        // use d3 to select box with id '#sample-metadata'
        var metabox = d3.select("#sample-metadata");

        //clears existing metadata
        metabox.html("");

        //appends metadata key and value to metabox

        Object.entries(result).forEach(([key, value]) => {
            metabox.append("h6").text(`${key.toUpperCase()}: ${value}`);
        });

    })
    
}

function buildCharts(sample){

    d3.json("samples.json").then((data) =>{
        var chartdata = data.samples;

        var chartResult = chartdata.filter(sampleObj => sampleObj.id == sample);
        console.log(chartResult);
        var sampleresult = chartResult[0];

        var otu_id = sampleresult.otu_ids;
        var otu_level = sampleresult.sample_values;
        var otu_labels = sampleresult.sample_labels;
        console.log(otu_id.slice(0,10));
        console.log(otu_level.slice(0,10));
        console.log(otu_labels);

        var top_id_array = otu_id.slice(0,10);

        // var new_otu_label = otu_label.splice(0,10);

        var id_array=[];
        //var top_id_array = id_array.slice(0,10);
        var top_id_level = otu_level.slice(0,10);
        console.log(top_id_array);
        console.log(top_id_level);

        top_id_array.forEach(element => id_array.push(`OTU${element}`));
        console.log(id_array);

        var graph = [{
            type: 'bar',
            y: id_array.reverse(),
            x: top_id_level.reverse(),
            // text: otu_labels.slice(0,10).reverse(),
            orientation: 'h'
        }];
    
       
          
        Plotly.newPlot('bar', graph);

        // var bubblearea = d3.select("#bubble");

        var bubbles = {
            title: "Bacteria Cultures Per Sample",
            margin: { t:0 },
            hovermode: "closest",
            xaxis: { title: "OTU ID"},
            margin: { t:30}
        };

        var bubbledata = [ {
            x: otu_level,  
            y: otu_id,
            text: otu_labels,
            mode: "markers",
            marker: {
                size: otu_level,
                color: otu_id,
                colorscale: "Earth"
            }
        }
    
        ];

    Plotly.newPlot("bubble",bubbledata, bubbles);


        // var grapharea = d3.select("#bar");

        // grapharea.html("")

          

    })
}
init()