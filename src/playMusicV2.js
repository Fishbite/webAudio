console.log("yeah! Landed!");

/* // ****** LICENSE NOTICE ****** \\
    COPYRIGHT: 2022 Stuart Peel 
    This PROGRAM is distributed under the terms of the:
    AGPL-3.0-or-later
*/

// ****** NOTE: script.js MUST BE LOADED ****** {{
// This commented out stuff is loaded via script.js

// Note: `actx` is already declared in script.js
// So, no need to define it again here.
// const actx = new AudioContext();

// ****** Variables To Setup Recording Ability Start ****** \\

// let mainVol = actx.createGain(),
//   // A mediaStreamDestination Node
//   streamDest = actx.createMediaStreamDestination(),
//   audioTag = document.getElementById("audioTag"),
//   stopBtn = document.getElementById("stopBtn"),
//   // Our Media Recorder
//   recorder = new MediaRecorder(streamDest.stream);

// // ****** Variables To Setup Recording Ability End ****** \\

// // Connect the mainVol to the destination stream and the speakers
// // All sound generators that we want to record must be connected
// // to mainVol
// mainVol.connect(streamDest); // connect to the stream
// mainVol.connect(actx.destination); // Connect to the speakers

// // ****** Pre-recorded Music Start ****** \\
// // A variable to store our arrayBuffer
// let soundBuffer;

// // A stereo panner node
// let panNode = actx.createStereoPanner();

// // Load the sound \\
// let xhr = new XMLHttpRequest();
// xhr.open("GET", "../upload/music.wav", true); // true: load asynchronously, create event

// // load as a binary file with responsType `arraybuffer`
// xhr.responseType = "arraybuffer";

// // load the sound
// xhr.send();

// xhr.addEventListener("load", onLoad, false);

// function onLoad(event) {
//   actx.decodeAudioData(
//     xhr.response,
//     (buffer) => {
//       soundBuffer = buffer;
//     },

//     (error) => {
//       throw new Error(`It no possibla decodie audioie ${error}`);
//     }
//   );
// }

// ****** Pre-recorded Music Start ****** \\

// A stereo panner node
let panNode = actx.createStereoPanner();

// global variables for our sound file
let fileURL; // var to store our ObjectURL
let soundBuffer; // A variable to store our arrayBuffer

// create a URL of the file object
function makeURL(event) {
  const file = this.files[0];
  //   const URL = window.URL;

  if (file) {
    console.log(file);

    // this works, so we can lose the var URL
    fileURL = window.URL.createObjectURL(file);
    console.log(fileURL);
  } else {
    // no file selected
    console.log("No file selected");
  }

  prepSound(fileURL);
}

// prep and decode the audio file
// basically, decode the audio file
// and stick it in a buffer for later
function prepSound(fileURL) {
  console.log("prepping!", fileURL);

  let xhr = new XMLHttpRequest();
  xhr.open("GET", fileURL, true);
  xhr.responseType = "arraybuffer";
  xhr.send();
  xhr.addEventListener("load", onload, false);

  function onload(event) {
    actx.decodeAudioData(
      xhr.response,
      (buffer) => {
        soundBuffer = buffer;
        console.log("soundBuffer", soundBuffer);
        console.log("xhr.response", xhr.response);
      },

      (error) => {
        throw new Error(`We have an error. No decodie! ${error}`);
      }
    );
  }
}

// Set the initial `pan` value
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

class playSoundBuffer {
  constructor(actx, soundBuffer) {
    this.actx = actx;
    this.soundBuffer = soundBuffer;
    this.soundNode = null;
    this.volumeNode = null;
    this.startTime = 0;

    if (!soundBuffer) {
      console.log("No sound buffer found");
    } else {
      this.soundNode = this.actx.createBufferSource();
      this.soundNode.buffer = soundBuffer;
      this.soundNode.loop = true;

      // need to check for the global audio context and a
      // audio graph that records live audio

      this.volumeNode = actx.createGain();
      this.volumeNode.gain.value = 0.5;

      if (typeof mainVol === "undefined" || typeof mainVol === null) {
        console.log("We DO NOT have a recording chain");
        this.soundNode.connect(this.volumeNode).connect(actx.destination);
        this.soundNode.start(actx.currentTime);
      } else {
        console.log("We have a recording chain");
        this.soundNode.connect(this.volumeNode).connect(mainVol);
        this.soundNode.start(actx.currentTime);
      }
    }
  }
  stop() {
    if (this.soundNode) this.soundNode.stop(actx.currentTime);
  }
}
// ****** Pre-recorded Music End ****** \\

// Kick Drum from scratch
// Oscillator frequency set at 150Hz

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
  constructor(actx, mainVol) {
    this.actx = actx;
    this.mainVol = mainVol;
  }
  setup() {
    this.osc = this.actx.createOscillator();
    this.vol = this.actx.createGain();
    this.osc.connect(this.vol);
    this.vol.connect(this.actx.destination);

    // *** Connect to the recording chain
    this.vol.connect(this.mainVol);
  }
  play(time) {
    this.setup();

    this.osc.frequency.setValueAtTime(150, time);
    this.vol.gain.setValueAtTime(0.5, time);

    this.osc.frequency.exponentialRampToValueAtTime(0.01, time + 0.5);
    this.vol.gain.exponentialRampToValueAtTime(0.01, time + 0.5);
    // console.log("Playing");
    this.vol.gain.linearRampToValueAtTime(0, time + 0.6);

    this.osc.start(time);

    // this.osc.stop(time + 0.55);
    // console.log("Stopped");
  }
}

// Lets see what our `soundEffects` function can do?
// Sounds more like a kettle drum because we have a
// `linearRampToValue` not an `exponentialRampToValue`
const echoValue = document.getElementById("echoValue"); // echo slider
const echoValueLable = document.getElementById("echoValueLabel"); // echo slider label

echoValue.addEventListener("change", updateEcho, false);

function updateEcho(e) {
  let val = parseFloat(echoValue.value);
  echoValueLable.innerHTML = val;
  setEcho = [val, val, 2000];
}

let setEcho = [0, 0, 2000];
// const reverb = [2, 5, false];
import { soundEffect } from "../lib/soundToRecorder.js";
function kettle1(echo = setEcho) {
  soundEffect(
    110, // 110 = A2
    0,
    0.5,
    "sine",
    0.5, // volume value
    -0.5,
    0,
    0,
    false,
    0,
    0,
    echo, //echo array: [delay, feedback, filter],
    undefined, //reverb array: [duration, decay, reverse?]
    mainVol
  );
}

function kettle2(echo = setEcho) {
  soundEffect(
    82.41, // 82.41 = E2
    0,
    0.5,
    "sine",
    0.5,
    0,
    0,
    0,
    false,
    0,
    0,
    echo, //echo array: [delay, feedback, filter],
    undefined, //reverb array: [duration, decay, reverse?]
    mainVol
  );
}

function kettle3(echo = setEcho) {
  soundEffect(
    61.74, // 61.74 = B1
    0,
    0.5,
    "sine",
    0.5,
    0.5,
    0,
    0,
    false,
    0,
    0,
    echo, //echo array: [delay, feedback, filter],
    undefined, //reverb array: [duration, decay, reverse?]
    mainVol
  );
}

// ****** A Snare Drum ******
// ...... from scratch! ......
class Snare {
  constructor(actx, mainVol) {
    this.actx = actx;
    this.mainVol = mainVol;
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

    // console.log(buffer);
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

    // *** Connect to the recording chain ***
    this.oscEnvelope.connect(this.mainVol);
    this.noiseEnvelope.connect(this.mainVol);
  }

  // Add some values to the nodes
  play(time) {
    this.setup();

    this.noiseEnvelope.gain.setValueAtTime(0.02125, time);
    this.noiseEnvelope.gain.exponentialRampToValueAtTime(0.001, time + 0.2);
    this.noise.start(time);

    this.osc.frequency.setValueAtTime(100, time);
    this.oscEnvelope.gain.setValueAtTime(0.1, time);
    this.oscEnvelope.gain.exponentialRampToValueAtTime(0.001, time + 0.1);
    this.osc.start(time);

    this.osc.stop(time + 0.2);
    this.noise.stop(time + 0.2);
  }
}

// A useful variable which for some reason doesn't
// work in the snare() and kick() functions below
// let now = actx.currentTime;
// console.log("now", now);

// lets wrap our snare class in a function so that we keep
// our api consistent and we can play our snare at any time
// by simply writing `snare()`
function snare() {
  let snare = new Snare(actx, mainVol);

  snare.play(actx.currentTime);
}

// ... and then do the same with our kick drum
function kick() {
  let kick = new Kick(actx, mainVol);

  let now = actx.currentTime;
  kick.play(now);
  // kick.play(now + 0.5);
  // kick.play(now + 1);
  // kick.play(now + 1.5);
  // kick.play(now + 2);
}

// ****** A HiHat ****** \\
import { assets } from "../lib/assets.js";
assets.load(["../audio/hihat2.wav"]).then(() => setup());
// and hihat function
function hihat() {
  let hihat = assets["../audio/hihat2.wav"];
  hihat.volume = 1;
  hihat.play();
}

// get the input element from the doc
const fileSelector = document.getElementById("file");
fileSelector.addEventListener("input", makeURL, false);

function setup() {
  window.addEventListener("keydown", playSample, false);

  // This `keydown handler plays the music sample
  function playSample(e) {
    switch (e.key) {
      // Play music normally (without panning)
      // If not recording, start the recorder
      // case "a":
      //   // if (recorder.state !== "recording") {
      //   //   startRecording();
      //   // }
      //   if (soundBuffer) {
      //     let soundNode = actx.createBufferSource();
      //     soundNode.buffer = soundBuffer;
      //     soundNode.loop = true;

      //     let volumeNode = actx.createGain();
      //     volumeNode.gain.value = 0.5;

      //     // Connect to the recording chain
      //     if (mainVol) {
      //       volumeNode.connect(mainVol);
      //     } // connect to global node
      //     soundNode.connect(volumeNode).connect(actx.destination);
      //     soundNode.start(actx.currentTime);

      //     window.addEventListener("keydown", keyDownHandler, false);
      //     function keyDownHandler(e) {
      //       if (e.key === "d") soundNode.stop();
      //     }
      //   }
      case "a":
        let run = new playSoundBuffer(actx, soundBuffer);

        window.addEventListener("keydown", keyDownHandler, false);
        function keyDownHandler(e) {
          if (e.key === "d") run.stop();
        }
        break;

      // Play music panning
      case "s":
        if (soundBuffer) {
          let soundNode = actx.createBufferSource();
          soundNode.buffer = soundBuffer;

          let volumeNode = actx.createGain();
          volumeNode.gain.value = 0.5;

          panNode.pan.value = -1;

          soundNode.loop = true;

          soundNode
            .connect(volumeNode)
            .connect(panNode)
            .connect(actx.destination);

          // Connect to the recording chain
          if (mainVol) {
            soundNode.connect(mainVol);
          }

          soundNode.start(actx.currentTime);
          panLoop();

          window.addEventListener("keydown", stopHandler, false);
          function stopHandler(e) {
            if (e.key === "d") {
              volumeNode.gain.exponentialRampToValueAtTime(
                0.0001,
                actx.currentTime + 0.03
              );
              soundNode.stop(actx.currentTime + 0.03);
              // soundNode.disconnect(volumeNode);
            }
          }
        }
        break;

      case "m":
        snare();
        break;

      case "z":
        kick();
        break;

      case "k":
        hihat();
        break;

      case "x":
        kettle1();
        break;

      case "c":
        kettle2();
        break;

      case "v":
        kettle3();
        break;
    }
  }
}
