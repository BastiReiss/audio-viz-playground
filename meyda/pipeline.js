var Meyda = require('meyda');
var R = require('ramda');
var D3 = require('d3');
var D3Heatmap = require('d3-heatmap');
var cubism = require('cubism');

var context = window.context = new AudioContext();
var tune = window.tune = new Audio('/audios/tighten_up.mp3');
var source = window.source = context.createMediaElementSource(tune);

source.connect(context.destination);

var data = [];
var meydaAnalyzer = Meyda.createMeydaAnalyzer({
  "audioContext":context,
  "source":source,
  "bufferSize": 2048,
  "featureExtractors": ["amplitudeSpectrum"],
  "callback": function(features){
    data.push(features.amplitudeSpectrum);
  }
});

var secondsToGrab = 60;

meydaAnalyzer.start(["amplitudeSpectrum"]);
source.mediaElement.play();
setTimeout(function(){
    source.mediaElement.pause();
    meydaAnalyzer.stop();
    // Color goes from min to max
    var ndata = R.flatten(data);
    console.log(R.reduce(R.min, 0, ndata));
    console.log(R.reduce(R.max, 0, ndata));

    var smallData = R.map(function(frequencies){
      return R.map(function(z) {
        return R.mean(z);
      }, R.splitEvery(16, frequencies));
    }, data);
    console.log(smallData);
    data = smallData;

    var chart = new D3Heatmap.default({
      target: document.getElementById("heat-map"),
      width: data.length * 10,
      height: data[0].length * 10,
      // gap: 0,
      // ,tickSize: 2
      type: 'circle',
      // ,
      axis: false
    });

    var chartData = [];
    for (var i = 0; i < data.length; i++) {
      var bins = [];
      for (var j = 0; j < data[i].length; j++) {
        bins.push({
          bin: j,
          count: (data[i][j] > 0 ? data[i][j] : 0)
        });
      }
      chartData.push({
        bin: i,
        bins: bins
      });
    }
    console.log(chartData);
    chart.render(chartData);

    // var context = cubism.context();
    // var horizon = context.horizon();
    //
    //
    //         var context = cubism.context()
    //             .step(864e5)
    //             .size(1280)
    //             .stop();
    //
    //         d3.select("#demo").selectAll(".axis")
    //             .data(["top", "bottom"])
    //           .enter().append("div")
    //             .attr("class", function(d) { return d + " axis"; })
    //             .each(function(d) { d3.select(this).call(context.axis().ticks(12).orient(d)); });
    //
    //         d3.select("body").append("div")
    //             .attr("class", "rule")
    //             .call(context.rule());
    //
    //         d3.select("body").selectAll(".horizon")
    //             .data(["AAPL", "BIDU", "SINA", "GOOG", "MSFT", "YHOO", "ADBE", "REDF", "INSP", "IACI", "AVID", "CCUR", "DELL", "DGII", "HPQ", "SGI", "SMCI", "SNDK", "SYNA"]
    //               .map(stock))
    //           .enter().insert("div", ".bottom")
    //             .attr("class", "horizon")
    //           .call(context.horizon()
    //             .format(d3.format("+,.2p")));
    //
    //         context.on("focus", function(i) {
    //           d3.selectAll(".value").style("right", i == null ? null : context.size() - i + "px");
    //         });
    //
    //         // Replace this with context.graphite and graphite.metric!
    //         function stock(name) {
    //           var format = d3.time.format("%d-%b-%y");
    //           return context.metric(function(start, stop, step, callback) {
    //             d3.csv("stocks/" + name + ".csv", function(rows) {
    //               rows = rows.map(function(d) { return [format.parse(d.Date), +d.Open]; }).filter(function(d) { return d[1]; }).reverse();
    //               var date = rows[0][0], compare = rows[400][1], value = rows[0][1], values = [value];
    //               rows.forEach(function(d) {
    //                 while ((date = d3.time.day.offset(date, 1)) < d[0]) values.push(value);
    //                 values.push(value = (d[1] - compare) / compare);
    //               });
    //               callback(null, values.slice(-context.size()));
    //             });
    //           }, name);
    //         }




  }, secondsToGrab * 1000);

window.data = data;

// var audioSource = read();
// var audioColorExtractor = extractColors(audioSource);
// var audioOutlines = outline(audioSource);
// var audioShapes = shapefy(audioSource);

// var paint = paint(audioColorExtractor, audioShapes, audioOutlines);
// var arc = arcIt(paint);
// render(arc);
