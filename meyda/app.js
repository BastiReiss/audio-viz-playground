var Meyda = require('meyda');

var context = new AudioContext();
var tune = new Audio('audio/guitar.mp3');
var source = context.createMediaElementSource(tune);

var options = {
  "audioContext":context, // required
  "source":source, // required
  "bufferSize": 512, // required
  "windowingFunction": "hamming", // optional
  "featureExtractors": ["rms"] // optional - A string, or an array of strings containing the names of features you wish to extract.
  "callback": Function // optional callback in which to receive the features for each buffer
};
var meydaAnalyzer = Meyda.createMeydaAnalyzer(options);

