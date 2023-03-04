console.log("Yo! There! crappy Mac O'");
// We have a crappy problem where our app doesn't
// work properly on Mac OS browsers, surprise!
// here we is just tryin to figure out why!

// The If statement's conditional seems to be ignored
// This is the critter:
/* 
    if (freq && !runningOscs[freq]) {
  playNote(freq);
  console.log(runningOscs);
}
*/

// `freq` is a variable holding the particular musical frequency
// mapped to the keyboard key being pressed by the user
// `runningOscs` is an object literal that holds currently playing
// oscillators and the frequency which that oscillator is set to e.g. 440Hz
// `playNote()` is a function that plays a note! LOL! it also copies the freq
// and oscillator to the `runningOscs` object

// instantiate the audio context
const audioCTX = new AudioContext();

const freq = 440;
let runningOscs = {};

function playNote(freq) {
  // create an oscilator
  const osc = audioCTX.createOscillator();
  osc.frequency.value = 220; // freq of osc
  osc.type = "sine"; // wave type for oscillator

  // gain node
  const vol = audioCTX.createGain();
  vol.gain.value = 1;

  // copy oscillator to runningOscs
  runningOscs[freq] = osc;
  console.log(runningOscs);

  // create the audio graph
  runningOscs[freq].connect(vol).connect(audioCTX.destination);

  // start the oscillator
  runningOscs[freq].start();
}

// event listeners
window.addEventListener("keydown", keyDownHandler, false);
window.addEventListener("keyup", keyupHandler, false);

// key handlers
function keyDownHandler(e) {
  if (e.repeat) return; // is key being held down? test for Mac OS
  if (freq && !runningOscs[freq]) {
    playNote(freq);
    console.log(runningOscs);
  }
}

function keyupHandler(e) {
  console.log("key is up man!");
  if (freq && runningOscs[freq]) {
    runningOscs[freq].stop();
    delete runningOscs[freq];
  }
}
