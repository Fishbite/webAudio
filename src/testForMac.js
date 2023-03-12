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

/*
 ****** Work Around For Keyboard Event Problems ******
 ****** On Apple Mac Computers START 1 ******
 */

let keyupTimer; // an ID returned by setTimeout
// Experiment with to following timeout. It should be as small as possible,
// but still great enough to resolve the problem on the specific device.
const keyupDelay = 50; // time between keyup event and actual stop of sound

/*
 ****** Work Around For Keyboard Event Problems ******
 ****** On Apple Mac Computers END 1 ******
 */

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
// function keyDownHandler(e) {
//   console.log(e.repeat);
//   if (e.repeat) return; // is key being held down? test for Mac OS
//   if (freq && !runningOscs[freq]) {
//     playNote(freq);
//     console.log(runningOscs);
//   }
// }

// function keyupHandler(e) {
//   console.log("key is up man!");
//   if (freq && runningOscs[freq]) {
//     runningOscs[freq].stop();
//     delete runningOscs[freq];
//   }
// }

/*
 ****** Work Around For Keyboard Event Problems ******
 ****** On Apple Mac Computers START 2 ******
 */
function keyDownHandler(e) {
  console.log(e.repeat);
  clearTimeout(keyupTimer); // abort the effect of a keyup that was triggered just before this event
  if (freq && !runningOscs[freq]) {
    playNote(freq);
    console.log(runningOscs);
  }
}

function keyupHandler(e) {
  clearTimeout(keyupTimer); // abort the effect of a previous keyup that was triggered just before this event
  // Delay the stop, so to allow a quick keydown event to cancel this from happening
  keyupTimer = setTimeout(() => {
    if (freq && runningOscs[freq]) {
      runningOscs[freq].stop();
      delete runningOscs[freq];
    }
  }, keyupDelay);
}

/*
 ****** Work Around For Keyboard Event Problems ******
 ****** On Apple Mac Computers END 2 ******
 */
