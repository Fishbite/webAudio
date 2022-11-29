console.log("distorion test connected!");
/*
    https://alexanderleon.medium.com/web-audio-series-part-2-designing-distortion-using-javascript-and-the-web-audio-api-446301565541
*/
var AudioContext = window.AudioContext || window.webkitAudioContext;
var audioCtx = new AudioContext();

var oscillatorNode = audioCtx.createOscillator();
var oscillatorGainNode = audioCtx.createGain();
oscillatorGainNode.gain.value = 0.001;
var finish = audioCtx.destination;

var distortionGainNode = audioCtx.createGain();
distortionGainNode.gain.value = 1;
var distortionNode = audioCtx.createWaveShaper();

function makeDistortionCurve(amount) {
  var k = amount,
    n_samples = typeof sampleRate === "number" ? sampleRate : 44100,
    curve = new Float32Array(n_samples),
    deg = Math.PI / 180,
    i = 0,
    x;
  for (; i < n_samples; ++i) {
    x = (i * 2) / n_samples - 1;
    curve[i] =
      ((3 + k) * Math.atan(Math.sinh(x * 0.25) * 5)) /
      (Math.PI + k * Math.abs(x));
  }
  return curve;
}

distortionNode.curve = makeDistortionCurve(400);

oscillatorNode.connect(oscillatorGainNode);
oscillatorGainNode.connect(distortionGainNode);
distortionGainNode.connect(distortionNode);
distortionNode.connect(finish);

document.addEventListener("click", () => oscillatorNode.start(0));
