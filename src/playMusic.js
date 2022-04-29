console.log("yeah! Landed!");

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

// ****** Pre-recorded Music Start ****** \\
// A variable to store our arrayBuffer
let soundBuffer;

// A stereo panner node
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

// This `keydown handler plays the music sample
function keyDownHandler(e) {
  switch (e.code) {
    // Play music normally (without panning)
    // If not recording, start the recorder
    case "KeyA":
      // if (recorder.state !== "recording") {
      //   startRecording();
      // }
      if (soundBuffer) {
        let soundNode = actx.createBufferSource();
        soundNode.buffer = soundBuffer;
        soundNode.loop = true;

        let volumeNode = actx.createGain();
        volumeNode.gain.value = 0.15;

        // Connect to the recording chain
        if (mainVol) {
          soundNode.connect(mainVol);
        } // connect to global node
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
      console.log("Arse");
      // If not recording, start the recorder
      // if (recorder.state !== "recording") {
      //   startRecording();
      // }
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

        // Connect to the recording chain
        if (mainVol) {
          soundNode.connect(mainVol);
        }

        soundNode.start(actx.currentTime);
        panLoop();

        window.addEventListener("keydown", stopHandler, false);
        function stopHandler(e) {
          if (e.code === "KeyD") {
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

    case "KeyM":
      // If not recording, start the recorder
      // if (recorder.state !== "recording") {
      //   startRecording();
      // }
      snare();

      break;

    case "KeyZ":
      // If not recording, start the recorder
      // if (recorder.state !== "recording") {
      //   startRecording();
      // }
      kick();

      break;

    case "KeyK":
      // If not recording, start the recorder
      // if (recorder.state !== "recording") {
      //   startRecording();
      // }
      hihat();

      break;
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
// ****** Pre-recorded Music End ****** \\

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
  constructor(actx, mainVol) {
    this.actx = actx;
    this.mainVol = mainVol;
  }
  setup() {
    this.osc = this.actx.createOscillator();
    this.gain = this.actx.createGain();
    this.osc.connect(this.gain);
    this.gain.connect(this.actx.destination);

    // *** Connect to the recording chain
    this.gain.connect(this.mainVol);
  }
  play(time) {
    this.setup();

    this.osc.frequency.setValueAtTime(150, time);
    this.gain.gain.setValueAtTime(0.25, time);

    this.osc.frequency.exponentialRampToValueAtTime(0.01, time + 0.5);
    this.gain.gain.exponentialRampToValueAtTime(0.01, time + 0.5);
    // console.log("Playing");
    this.gain.gain.linearRampToValueAtTime(0, time + 0.6);

    this.osc.start(time);

    // this.osc.stop(time + 0.55);
    // console.log("Stopped");
  }
}

// Lets see what our `soundEffect ` function can do?
// Sounds more like a kettle drum because we have a
// `linearRampToValue` not an `exponentialRampToValue`
import { soundEffect } from "../lib/soundToRecorder.js";
function kettle1() {
  soundEffect(
    150,
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
    undefined,
    undefined,
    mainVol
  );
}

function kettle2() {
  soundEffect(
    100,
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
    undefined,
    undefined,
    mainVol
  );
}

function kettle3() {
  soundEffect(
    80,
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
    undefined,
    undefined,
    mainVol
  );
}

// Lets import a useful function :)
import { keyboard } from "../lib/interactive.js";

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

    this.noiseEnvelope.gain.setValueAtTime(0.0525, time);
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

// lets wrap our snare class in a function so that we keep
// our api consistent and we can play our snare at any time
// by simply writing `snare()`
function snare() {
  let snare = new Snare(actx, mainVol);
  let now = actx.currentTime;
  snare.play(now);
}

// ... and then do the same with our kick drum
function kick() {
  let kick = new Kick(actx, mainVol);

  let now = actx.currentTime;
  kick.play(now);
  //   // kick.play(now + 0.5);
  //   // kick.play(now + 1);
  //   // kick.play(now + 1.5);
  //   // kick.play(now + 2);
}

// ****** A HiHat ****** \\
import { assets } from "../lib/assets.js";
assets.load(["../audio/hihat2.wav"]).then(() => setup());
// and hihat function
function hihat() {
  let hihat = assets["../audio/hihat2.wav"];
  hihat.volume = 0.5;
  hihat.play();
}

function setup() {
  // ****** ****** Keyboard Controls ****** ****** \\
  // Setup the keyboard
  let z = keyboard(90);
  let x = keyboard(88);
  let c = keyboard(67);
  let v = keyboard(86);
  let m = keyboard(77);
  let k = keyboard(75);

  // Play the hihat
  // k.press = () => {
  //   hihat();
  // };

  // Play the Kick
  // z.press = () => {
  //   kick();
  // };

  // Play the kettle1
  x.press = () => {
    kettle1();
  };
  c.press = () => {
    kettle2();
  };
  v.press = () => {
    kettle3();
  };
  // Play the snare
  // m.press = () => {
  //   snare();
  // };
}
