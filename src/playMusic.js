console.log("yeah! Landed!");

// const actx = new AudioContext();

let soundBuffer;

let panNode = actx.createStereoPanner();

// Load the sound \\
let xhr = new XMLHttpRequest();
xhr.open("GET", "../audio/music.wav", true); // true: load asynchronously, create event

// load as a binary file with responsType `arraybuffer`
xhr.responseType = "arraybuffer";

// load the sound
xhr.send();

xhr.addEventListener("load", onLoad, false);

function onLoad(event) {
  actx.decodeAudioData(
    xhr.response,
    (buffer) => {
      soundBuffer = buffer;
    },

    (error) => {
      throw new Error(`It no possibla decodie audioie ${error}`);
    }
  );
}

window.addEventListener("keydown", keyDownHandler, false);

function keyDownHandler(e) {
  switch (e.code) {
    // Play music normally
    case "KeyA":
      if (soundBuffer) {
        let soundNode = actx.createBufferSource();
        soundNode.buffer = soundBuffer;
        soundNode.loop = true;

        let volumeNode = actx.createGain();
        volumeNode.gain.value = 0.15;

        soundNode.connect(volumeNode).connect(actx.destination);
        soundNode.start(actx.currentTime);

        window.addEventListener("keydown", keyDownHandler, false);
        function keyDownHandler(e) {
          if (e.code === "KeyD") soundNode.stop();
        }
      }
      break;

    // Play music panning
    case "KeyS":
      if (soundBuffer) {
        let soundNode = actx.createBufferSource();
        soundNode.buffer = soundBuffer;

        let volumeNode = actx.createGain();
        volumeNode.gain.value = 0.2;

        panNode.pan.value = -1;

        soundNode.loop = true;

        soundNode
          .connect(volumeNode)
          .connect(panNode)
          .connect(actx.destination);

        soundNode.start(actx.currentTime);
        panLoop();

        window.addEventListener("keydown", keyDownHandler, false);
        function keyDownHandler(e) {
          if (e.code === "KeyD") {
            volumeNode.gain.exponentialRampToValueAtTime(
              0.0001,
              actx.currentTime + 0.03
            );
            soundNode.stop(actx.currentTime + 0.03);
            soundNode.disconnect(volumeNode);
          }
        }
      }
      break;
  }
}

let pan = "left";

// A panLoop that pans the sound from ear to ear
function panLoop() {
  requestAnimationFrame(panLoop);

  if (pan === "left" && panNode.pan.value < 1) {
    panNode.pan.value += 0.0125;
    // stop panning from the left to right
    if (panNode.pan.value >= 1) pan = "right";
  }

  if (pan === "right" && panNode.pan.value >= -1) {
    panNode.pan.value -= 0.0125;
    // stop panning from the right to left
    if (panNode.pan.value <= -1) pan = "left";
  }
}

// Kick Drum from scratch
// Oscillator frequency set at 150Hz
// A useful variable!
let now = actx.currentTime;
console.log("now", now);

// Create the nodes
// let kickOsc = actx.createOscillator();
// let kickGain = actx.createGain();
// Set the oscillator frequency
// kickOsc.frequency.value = 150;

// connect the nodes
// kickOsc.connect(kickGain);
// kickGain.connect(actx.destination);

// set the start volume
// kickGain.gain.setValueAtTime(1, now);

// Ramp the volume down over 1/2 sec
// Note: We don't have this ramp in the sound function
// kickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);

// Now we can rapidly drop the oscillator frequency
// kickOsc.frequency.setValueAtTime(150, now);
// kickOsc.frequency.exponentialRampToValueAtTime(0.001, now + 0.5);

// Start and stop the oscillator
// kickOsc.start(now);
// kickOsc.stop(now + 0.5);

// Now! Because we can't restart an oscilator once it has been stopped
// we need to wrap the code in a simple object

// ****** A Kick Drum ******
// Because we can't restart an oscilator once it has been stopped
// we need to wrap the code in a simple object
class Kick {
  constructor(actx) {
    this.actx = actx;
  }
  setup() {
    this.osc = this.actx.createOscillator();
    this.gain = this.actx.createGain();
    this.osc.connect(this.gain);
    this.gain.connect(this.actx.destination);
  }
  play(time) {
    this.setup();

    this.osc.frequency.setValueAtTime(150, time);
    this.gain.gain.setValueAtTime(0.2, time);

    this.osc.frequency.exponentialRampToValueAtTime(0.01, time + 0.5);
    this.gain.gain.exponentialRampToValueAtTime(0.01, time + 0.5);
    // console.log("Playing");
    // this.gain.gain.linearRampToValueAtTime(0, time + 0.05);

    this.osc.start(time);

    this.osc.stop(time + 0.55);
    // console.log("Stopped");
  }
}

import { impulseResponse } from "../lib/sound.js";
import { keyboard } from "../lib/interactive.js";

// ****** A Snare Drum ******

class Snare {
  constructor(actx) {
    this.actx = actx;
  }
  // Synthesize the rattle of the wire by creating
  // a random noise generator
  noiseBuffer() {
    const bufferSize = this.actx.sampleRate;
    let buffer = this.actx.createBuffer(1, bufferSize, this.actx.sampleRate);
    let output = buffer.getChannelData(0);

    // fill the buffer with random numbers between
    // 1 and -1 to create white noise
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    console.log(buffer);
    return buffer;
  }
  // Remove some of the lowest frequency sounds
  // to create a more realistic snare sound
  setup() {
    this.noise = this.actx.createBufferSource();
    this.noise.buffer = this.noiseBuffer();

    let noiseFilter = this.actx.createBiquadFilter();
    noiseFilter.type = "highpass";
    noiseFilter.frequency.value = 1000;

    this.noise.connect(noiseFilter);

    // Setup the envelope
    this.noiseEnvelope = this.actx.createGain();
    noiseFilter.connect(this.noiseEnvelope);
    this.noiseEnvelope.connect(this.actx.destination);

    // Add a short snap to the front of the sound
    this.osc = this.actx.createOscillator();
    this.osc.type = "trianlge";

    this.oscEnvelope = this.actx.createGain();
    this.osc.connect(this.oscEnvelope);
    this.oscEnvelope.connect(this.actx.destination);
  }

  // Add some values to the nodes
  play(time) {
    this.setup();

    this.noiseEnvelope.gain.setValueAtTime(0.025, time);
    this.noiseEnvelope.gain.exponentialRampToValueAtTime(0.01, time + 0.2);
    this.noise.start(time);

    this.osc.frequency.setValueAtTime(100, time);
    this.oscEnvelope.gain.setValueAtTime(0.7, time);
    this.oscEnvelope.gain.exponentialRampToValueAtTime(0.01, time + 0.1);
    this.osc.start(time);

    this.osc.stop(time + 0.2);
    this.noise.stop(time + 0.2);
  }
}

// ****** A HiHat ****** \\
import { assets } from "../lib/assets.js";
assets.load(["../audio/hihat.wav"]).then(() => setup());

// import { makeSound } from "../lib/sound.js";

function setup() {
  // ****** ****** Keyboard Controls ****** ****** \\
  // Setup the keyboard
  let z = keyboard(90);
  let m = keyboard(77);
  let k = keyboard(75);

  // console.log(assets());

  let hihat = assets["../audio/hihat.wav"];
  hihat.volume = 0.1;

  // Play the hihat
  k.press = () => {
    hihat.play();
  };

  // Play the Kick
  z.press = () => {
    let kick = new Kick(actx);
    let now = actx.currentTime;
    kick.play(now);
    //   // kick.play(now + 0.5);
    //   // kick.play(now + 1);
    //   // kick.play(now + 1.5);
    //   // kick.play(now + 2);
  };
  // Play the snare
  m.press = () => {
    let snare = new Snare(actx);
    let now = actx.currentTime;

    snare.play(now);
  };
}
