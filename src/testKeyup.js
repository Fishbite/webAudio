console.log("Tested!!!");
import { keyboard } from "../lib/keyboard.js";

const actx = new AudioContext();
const oscOn = {};

// var to hold the state of key down
// TODO: make this into an array to
// hold the state of all keys pressed
let keyPlaying = false;

const notes = {
  q: 440,
  w: 880,
};

function playNote(key) {
  console.log(keyPlaying);

  let osc, vol;

  // TODO: need to check the exact key state

  osc = actx.createOscillator();
  vol = actx.createGain();

  osc.frequency.value = notes[key];
  osc.type = "sine";
  vol.gain.value = 0.1;

  oscOn[key] = osc;

  oscOn[key].connect(vol).connect(actx.destination);
  console.log(oscOn[key]);

  osc.start();
}

// let qKey = keyboard("q");

// qKey.press = function () {
//   playNote(notes.qKey, qKey);
// };

window.addEventListener("keydown", keydownHandler, false);
window.addEventListener("keyup", keyupHandler, false);

function keydownHandler(event) {
  const key = event.key;
  if (notes[key] && !oscOn[key]) {
    playNote(key);
  }
}

function keyupHandler(event) {
  const key = event.key;
  if (notes[key] && oscOn[key]) {
    oscOn[key].stop();
    delete oscOn[key];
  }
}
