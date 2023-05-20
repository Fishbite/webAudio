// import { soundEffect } from "../lib/soundToRecorder";

// import code to generate musical notes & keyboard map
import { notes } from "./notes.js";

console.log("Connected to the moon!");

/* // ****** LICENSE NOTICE ****** \\
      COPYRIGHT: 2020 Stuart Peel 
      This PROGRAM is distributed under the terms of the:
      AGPL-3.0-or-later

      What does this  mean? Well, basically it free!
      Do what you want with it:

        Use it
        Modify it
        Give it away as a freebee!
        Sell it
        Distribute it
      
      If you modify it, please make it available to everyone, 
      it's part of the license T's & C's

      // ****** LICENSE NOTICE ****** \\
*/

/*
  This file:

  Connects to the user interface to give the user the ability to change some attributes of the notes:

    * Decay - the duration of the note/s to be played

    * Wave Form - sine, traingle, square & sawtooth

    * Octave value - to give facilitate the full range of notes
      from octave 0 through to octave 7

    * voicePicker - select voices from a dropdown list

    * Creates the synth' voices

*/

// ************* Sop Button START ************ \\
const stopBtn = document.getElementById("stopBtn");
// ************* Sop Button END ************ \\

// ************* GUI Slider Controls START ************ \\
// Get the slider control elements from the document
const waveTypeValue = document.getElementById("waveTypeValue"); // INPUT wave form slider
const waveTypeLabel = document.getElementById("waveTypeLabel");
const decayTimeValue = document.getElementById("decayTimeValue"); // INPUT decay time slider
const decayTimeLabel = document.getElementById("decayTimeLabel");
const octaveValue = document.getElementById("octaveValue"); // INPUT octave value slider
const octaveValueLabel = document.getElementById("octaveValueLabel");

// For the range slider to select wave type
waveTypeValue.addEventListener("change", updateWaveType);

const waveTypes = ["sine", "triangle", "square", "sawtooth"];
decayTimeValue.addEventListener("change", updateDecay, false);

octaveValue.addEventListener("change", updateOctaveValue, false);

// `vars` read by `function playNote()`
let setWave,
  setDecay = 2;

export let octaveCurrent = 4;

function updateWaveType(e) {
  setWave = waveTypes[waveTypeValue.value];
  waveTypeLabel.innerHTML = setWave.slice(0, 3);
  return setWave;
}

function updateDecay(e) {
  setDecay = parseFloat(decayTimeValue.value);

  decayTimeLabel.innerHTML = setDecay;
  return setDecay;
}

// event listener callback functions update `vars` for `playNote()` & the GUI labels
function updateOctaveValue(e) {
  octaveCurrent = parseFloat(octaveValue.value);

  octaveValueLabel.innerHTML = octaveCurrent;
  console.log("`octaveCurrent` value:", octaveCurrent);

  console.log(notes.y);
}
// ************* GUI Slider Controls END ************ \\

// ************* GUI Voice Picker START ************ \\
let voice = "";
let voicePicker = document.getElementById("voice");
voicePicker.addEventListener("change", setVoice, false);

function setVoice(e) {
  console.log(voice);
  console.log(e.target.value);
  voice = e.target.value;
  console.log(voice);
}
// ************* GUI Voice Picker END ************ \\

// ************* Voice Generators START ************ \\

// objects to hold running oscillators
const runningOscs = {};
const runningOscs2 = {};
const runningOscs3 = {};

// This function just sets default values for oscillator values
// then runs the create oscillator function for the current voice

function playNote(freq = 261.63, type = setWave, decay = setDecay) {
  // Create a new oscillator and audio graph for each keypress
  if (voice === "one") {
    createOsc(freq, type, decay); // one soft osc
  }

  if (voice === "two") {
    createOsc2(freq, type, decay); // two soft osc's
  }

  if (voice === "three") {
    createOsc5(freq, type, decay); // plinky plonky reverb
  }

  if (voice === "four") {
    createOsc6(freq, type, decay); // distortion &  reverb in a church
  }

  if (voice === "five") {
    createOsc7(freq, type, decay); // nice bass in octave 2
  }

  if (voice === "six") {
    createOsc8(freq, type, decay); // chatGPT
  }

  if (voice === "seven") {
    // Slot for 'Experimental stuff
  }
}

// This function creates soft sounding oscilators that use compressors and ramps
// to take the volume down to zero in order to help eleminate those ugly "clicks"
// We are recording these better sounds
// **** voice =  one soft osc ****
function createOsc(freq, type = "sine", decay) {
  console.log(freq, type, decay);

  // create oscillator, gain and compressor nodes
  let osc = actx.createOscillator();
  let vol = actx.createGain();
  let compressor = actx.createDynamicsCompressor();

  // set the supplied values
  osc.frequency.value = freq;
  osc.type = type;

  // copy the osc to the runningOscs object
  runningOscs[freq] = osc;
  // console.log(runningOscs[freq]);

  // set the volume value so that we do not overload the destination
  // when multiple voices are played simmultaneously
  vol.gain.value = 0.1;

  // Now, do we have a recording facility set up for us in the global scope?
  // If we do, let's connect our audio graph to it so that we can record
  // our live music directly from the audio nodes, rather than a microphone :->
  // All we need to do is connect our compressor node to the `mainVol` node
  // defined in the global scope
  if (mainVol) {
    // Let's get connected!!!!
    runningOscs[freq].connect(vol).connect(compressor).connect(mainVol);
  } else {
    //create the audio graph
    runningOscs[freq]
      .connect(vol)
      .connect(compressor)
      .connect(actx.destination);
  }

  // Set the start point of the ramp down
  // vol.gain.setValueAtTime(vol.gain.value, actx.currentTime + decay);
  vol.gain.setValueAtTime(vol.gain.value, actx.currentTime);

  // ramp down to minimise the ugly click when the oscillator stops
  vol.gain.exponentialRampToValueAtTime(
    0.0001,
    actx.currentTime + decay + 0.03
  );

  // Finally ramp down to zero to avoid any glitches because the volume
  // never actually reaches zero with an exponential ramp down
  vol.gain.linearRampToValueAtTime(0, actx.currentTime + decay + 0.03);

  runningOscs[freq].start();
  // osc.stop(actx.currentTime + decay + 0.03);
}

// attempting to create a different sound using 2 oscillators
// just by offsetting the frequency of one oscillator has
// quite a profound effect giving a much richer sound
// **** voice = two soft oscillators ****
function createOsc2(freq, type = "sine", decay) {
  console.log(freq, type, decay);

  // create oscillator, gain and compressor nodes
  let osc = actx.createOscillator();
  let osc2 = actx.createOscillator();
  let vol = actx.createGain();
  let compressor = actx.createDynamicsCompressor();

  // set the supplied values
  osc.frequency.value = freq;
  osc2.frequency.value = freq - freq * 0.01;
  osc.type = type;
  osc2.type = type;

  // copy the osc to the runningOscs object
  runningOscs[freq] = osc;
  runningOscs2[freq] = osc2;
  // console.log(runningOscs[freq]);

  // set the volume value so that we do not overload the destination
  // when multiple voices are played simmultaneously
  vol.gain.value = 0.1;

  // Now, do we have a recording facility set up for us in the global scope?
  // If we do, let's connect our audio graph to it so that we can record
  // our live music directly from the audio nodes, rather than a microphone :->
  // All we need to do is connect our compressor node to the `mainVol` node
  // defined in the global scope
  if (mainVol) {
    // Let's get connected!!!!
    runningOscs[freq].connect(vol).connect(compressor).connect(mainVol);
    runningOscs2[freq].connect(vol).connect(compressor).connect(mainVol);
  } else {
    //create the audio graph
    runningOscs[freq]
      .connect(vol)
      .connect(compressor)
      .connect(actx.destination);

    runningOscs2[freq]
      .connect(vol)
      .connect(compressor)
      .connect(actx.destination);
  }

  // Set the start point of the ramp down
  // vol.gain.setValueAtTime(vol.gain.value, actx.currentTime + decay);
  vol.gain.setValueAtTime(vol.gain.value, actx.currentTime);

  // ramp down to minimise the ugly click when the oscillator stops
  vol.gain.exponentialRampToValueAtTime(
    0.0001,
    actx.currentTime + decay + 0.03
  );

  // Finally ramp down to zero to avoid any glitches because the volume
  // never actually reaches zero with an exponential ramp down
  vol.gain.linearRampToValueAtTime(0, actx.currentTime + decay + 0.03);

  runningOscs[freq].start();
  runningOscs2[freq].start();
  // osc.stop(actx.currentTime + decay + 0.03);
}

// https://stackoverflow.com/questions/22312841/waveshaper-node-in-webaudio-how-to-emulate-distortion
// let distortionNode = actx.createWaveShaper();
// distortionNode.curve = makeDistortionCurve();

// function makeDistortionCurve(amount = 20) {
//   let n_samples = 256,
//     curve = new Float32Array(n_samples);
//   for (let i = 0; i < n_samples; ++i) {
//     let x = (i * 2) / n_samples - 1;
//     curve[i] = ((Math.PI + amount) * x) / (Math.PI + amount * Math.abs(x));
//   }
//   return curve;
// }

// // with distortion curve above
// function createOsc4(freq, type = "sine", decay) {
//   console.log(freq, type, decay);

//   // create oscillator, gain and compressor nodes
//   let osc = actx.createOscillator();
//   let vol = actx.createGain();
//   let compressor = actx.createDynamicsCompressor();
//   // let distortionNode = actx.createWaveShaper();
//   // distortionNode.curve = makeDistortionCurve();

//   // set the supplied values
//   osc.frequency.value = freq;
//   osc.type = type;

//   // copy the osc to the runningOscs object
//   runningOscs[freq] = osc;
//   // console.log(runningOscs[freq]);

//   // set the volume value so that we do not overload the destination
//   // when multiple voices are played simmultaneously
//   vol.gain.value = 0.01;

//   // Now, do we have a recording facility set up for us in the global scope?
//   // If we do, let's connect our audio graph to it so that we can record
//   // our live music directly from the audio nodes, rather than a microphone :->
//   // All we need to do is connect our compressor node to the `mainVol` node
//   // defined in the global scope
//   if (mainVol) {
//     // Let's get connected!!!!
//     runningOscs[freq]
//       .connect(vol)
//       .connect(distortionNode)
//       .connect(compressor)
//       .connect(mainVol);
//   } else {
//     //create the audio graph
//     runningOscs[freq]
//       .connect(vol)
//       .connect(distortionNode)
//       .connect(compressor)
//       .connect(actx.destination);
//   }

//   // Set the start point of the ramp down
//   // vol.gain.setValueAtTime(vol.gain.value, actx.currentTime + decay);
//   vol.gain.setValueAtTime(vol.gain.value, actx.currentTime);

//   // ramp down to minimise the ugly click when the oscillator stops
//   vol.gain.exponentialRampToValueAtTime(
//     0.0001,
//     actx.currentTime + decay + 0.03
//   );

//   // Finally ramp down to zero to avoid any glitches because the volume
//   // never actually reaches zero with an exponential ramp down
//   vol.gain.linearRampToValueAtTime(0, actx.currentTime + decay + 0.03);

//   runningOscs[freq].start();
//   // osc.stop(actx.currentTime + decay + 0.03);
// }

// apply impulse response recording to convolver node
// https://developer.mozilla.org/en-US/docs/Web/API/ConvolverNode
async function createReverb(path) {
  let convolver = actx.createConvolver();

  // load impulse response from file
  let response = await fetch(path);

  // let response = await fetch("../audio/1st_baptist_nashville_far_wide.wav");

  // let response = await fetch("../audio/1st_baptist_nashville_far_close.wav");

  let arraybuffer = await response.arrayBuffer();
  convolver.buffer = await actx.decodeAudioData(arraybuffer);

  return convolver;
}

const reverb = await createReverb("../audio/IRwav2.wav");
const reverb2 = await createReverb(
  "../audio/1st_baptist_nashville_far_wide.wav"
);
// reverb;
// console.log(reverb);

// someOtherAudioNode -> reverb -> destination
// someOtherAudioNode.connect(reverb);
// reverb.connect(audioCtx.destination);

// with convolver.
// this instrument attempts to get closer to that of
// an actual stringed instrument, where the initial
// strike of the string decays exopnentially and then
// continues at a lower magnitude for a preiod of time
// voice **** plinky plonky reverb ****
function createOsc5(freq, type = "sine", decay) {
  console.log(freq, type, decay);

  // create oscillator, gain compressor and convolver nodes

  let osc = actx.createOscillator();
  let osc2 = actx.createOscillator();
  let vol = actx.createGain();
  let volOsc = actx.createGain();
  let volOsc2 = actx.createGain();
  osc.type = "sine";
  osc2.type = "triangle";

  osc.frequency.value = freq;
  osc2.frequency.value = osc.frequency.value + 1;

  // let compressor = actx.createDynamicsCompressor();

  // set the supplied values
  // osc.frequency.value = freq;
  osc.type = type;

  // copy the osc to the runningOscs object
  runningOscs[freq] = osc;
  runningOscs2[freq] = osc2;
  // console.log(runningOscs[freq]);

  // set the volume value so that we do not overload the destination
  // when multiple voices are played simmultaneously
  vol.gain.value = 2;

  // Now, do we have a recording facility set up for us in the global scope?
  // If we do, let's connect our audio graph to it so that we can record
  // our live music directly from the audio nodes, rather than a microphone :->
  // All we need to do is connect our compressor node to the `mainVol` node
  // defined in the global scope
  if (mainVol) {
    // Let's get connected!!!!
    runningOscs[freq].connect(volOsc).connect(vol);
    runningOscs2[freq].connect(volOsc2).connect(vol);
    // connect `vol` to the convolver held in var `reverb`
    vol.connect(reverb).connect(mainVol);
  } else {
    //create the audio graph
    runningOscs[freq].connect(volOsc).connect(vol);
    runningOscs2[freq].connect(volOsc2).connect(vol);
    vol.connect(reverb).connect(actx.destination);
  }

  // create the envelope
  volOsc.gain.setValueAtTime(0.08, actx.currentTime);
  volOsc.gain.exponentialRampToValueAtTime(0.008, actx.currentTime + decay / 4);

  volOsc2.gain.setValueAtTime(0.2, actx.currentTime);
  volOsc2.gain.exponentialRampToValueAtTime(0.02, actx.currentTime + decay / 4);

  volOsc.gain.linearRampToValueAtTime(0, actx.currentTime + decay + 2.5);
  volOsc2.gain.linearRampToValueAtTime(0, actx.currentTime + decay + 2.5);

  runningOscs[freq].start();
  runningOscs2[freq].start();
  // osc.stop(actx.currentTime + decay + 0.03);
}

/*
    https://alexanderleon.medium.com/web-audio-series-part-2-designing-distortion-using-javascript-and-the-web-audio-api-446301565541
*/
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

// as `createOsc5` with added distortion
// **** voice = Distortion & Reverb in a Church ****
function createOsc6(freq, type = "sine", decay) {
  console.log(freq, type, decay);

  // create the stuff we need for the audio graph

  let osc = actx.createOscillator();
  let osc2 = actx.createOscillator();
  let distortionNode = actx.createWaveShaper();

  let vol = actx.createGain();
  let volOsc = actx.createGain();
  let volOsc2 = actx.createGain();
  let distortionVol = actx.createGain();

  // set some values for each node
  distortionNode.curve = makeDistortionCurve(700);

  osc.type = "sine";
  osc2.type = "triangle";

  osc.frequency.value = freq;
  osc2.frequency.value = osc.frequency.value + 1;

  let compressor = actx.createDynamicsCompressor();

  // set the supplied values
  // osc.frequency.value = freq;
  osc.type = type;

  // copy the osc to the runningOscs object
  runningOscs[freq] = osc;
  runningOscs2[freq] = osc2;
  // console.log(runningOscs[freq]);

  // set the volume value so that we do not overload the destination
  // when multiple voices are played simmultaneously
  vol.gain.value = 0.01;
  distortionVol.gain.value = 2;

  // Now, do we have a recording facility set up for us in the global scope?
  // If we do, let's connect our audio graph to it so that we can record
  // our live music directly from the audio nodes, rather than a microphone :->
  // All we need to do is connect our compressor node to the `mainVol` node
  // defined in the global scope
  if (mainVol) {
    // Let's get connected!!!!
    runningOscs[freq].connect(volOsc).connect(vol);
    runningOscs2[freq].connect(volOsc2).connect(vol);
    // commented out to find cause of volume prolem with distortion
    // hooking up reverb to the chain cause sounds like an
    // electrical connection problem
    // vol
    //   .connect(reverb2)
    //   .connect(distortionNode)
    //   .connect(distortionVol)
    //   .connect(compressor)
    //   .connect(mainVol);

    // this seems to work ok - test more!
    // hooking up the reverb (convolver) node as the last but one
    // node in the chain seems to REDUCE those electrical
    // connection problem sounds (crackling noises)
    // plus the volume appears to remain stable and consistent
    vol
      .connect(distortionNode)
      .connect(distortionVol)
      .connect(compressor)
      .connect(reverb2)
      .connect(mainVol);

    // vol.connect(mainVol);
  } else {
    //create the audio graph
    runningOscs[freq].connect(volOsc).connect(vol);
    runningOscs2[freq].connect(volOsc2).connect(vol);
    // commented out to find cause of volume prolem with distortion
    // vol.connect(reverb).connect(distortionNode).connect(actx.destination);
    vol
      .connect(distortionNode)
      .connect(distortionVol)
      .connect(compressor)
      .connect(reverb2)
      .connect(actx.destination);
  }

  // create the envelope
  volOsc.gain.setValueAtTime(0.04, actx.currentTime);
  volOsc.gain.exponentialRampToValueAtTime(0.004, actx.currentTime + decay / 4);

  volOsc2.gain.setValueAtTime(0.1, actx.currentTime);
  volOsc2.gain.exponentialRampToValueAtTime(0.01, actx.currentTime + decay / 4);

  distortionVol.gain.setValueAtTime(distortionVol.gain.value, actx.currentTime);
  distortionVol.gain.exponentialRampToValueAtTime(
    distortionVol.gain.value,
    actx.currentTime + decay / 4
  );

  volOsc.gain.linearRampToValueAtTime(0, actx.currentTime + decay);
  volOsc2.gain.linearRampToValueAtTime(0, actx.currentTime + decay);
  distortionVol.gain.linearRampToValueAtTime(0, actx.currentTime + decay);

  runningOscs[freq].start();
  runningOscs2[freq].start();
  // osc.stop(actx.currentTime + decay + 0.03);
}

// **** voice = Nice Bass in Octave 2 ****
// here we use 3 slightly detuned oscillators
// along with a `lowshelf` filter which together
// produces a lovely rich phased sound, especially
// at lower frequency octaves 2 & 3
function createOsc7(freq, type = "sine", decay) {
  console.log(freq, type, decay);

  // create oscillator, gain, filter and compressor nodes
  let osc = actx.createOscillator();
  let osc2 = actx.createOscillator();
  let osc3 = actx.createOscillator();
  let vol = actx.createGain();
  let compressor = actx.createDynamicsCompressor();
  let biquadFilter = actx.createBiquadFilter();

  // set the supplied values
  osc.frequency.value = freq;
  osc2.frequency.value = freq - freq * 0.01;
  osc3.frequency.value = freq + freq * 0.01;
  osc.type = type;
  osc2.type = type;
  osc3.type = type;

  // copy the osc to the runningOscs object
  runningOscs[freq] = osc;
  runningOscs2[freq] = osc2;
  runningOscs3[freq] = osc3;
  // console.log(runningOscs[freq]);

  // set the volume value so that we do not overload the destination
  // when multiple voices are played simmultaneously
  vol.gain.value = 0.005;

  // Now, do we have a recording facility set up for us in the global scope?
  // If we do, let's connect our audio graph to it so that we can record
  // our live music directly from the audio nodes, rather than a microphone :->
  // All we need to do is connect our compressor node to the `mainVol` node
  // defined in the global scope
  if (mainVol) {
    // Let's get connected!!!!
    runningOscs[freq]
      .connect(biquadFilter)
      .connect(vol)
      .connect(compressor)
      .connect(mainVol);
    runningOscs2[freq]
      .connect(biquadFilter)
      .connect(vol)
      .connect(compressor)
      .connect(mainVol);
    runningOscs3[freq]
      .connect(biquadFilter)
      .connect(vol)
      .connect(compressor)
      .connect(mainVol);
  } else {
    //create the audio graph
    runningOscs[freq]
      .connect(vol)
      .connect(compressor)
      .connect(actx.destination);

    runningOscs2[freq]
      .connect(vol)
      .connect(compressor)
      .connect(actx.destination);

    runningOscs3[freq]
      .connect(vol)
      .connect(compressor)
      .connect(actx.destination);
  }

  // Set the start point of the ramp down
  // vol.gain.setValueAtTime(vol.gain.value, actx.currentTime + decay);
  vol.gain.setValueAtTime(vol.gain.value, actx.currentTime);

  // ramp down to minimise the ugly click when the oscillator stops
  vol.gain.exponentialRampToValueAtTime(
    0.0001,
    actx.currentTime + decay + 0.03
  );

  // Finally ramp down to zero to avoid any glitches because the volume
  // never actually reaches zero with an exponential ramp down
  vol.gain.linearRampToValueAtTime(0, actx.currentTime + decay + 0.5);

  biquadFilter.type = "lowshelf";
  biquadFilter.frequency.setValueAtTime(1000, actx.currentTime);
  // not used on the `lowshelf` filter type
  // biquadFilter.Q.setValueAtTime(10, actx.currentTime);

  // set the gain value (in decibels) of the boosted
  // frequencies
  biquadFilter.gain.setValueAtTime(25, actx.currentTime);

  runningOscs[freq].start();
  runningOscs2[freq].start();
  runningOscs3[freq].start();
  // osc.stop(actx.currentTime + decay + 0.03);
}

/* Not sure what we were doing here
let osc;
function createOsc8(freq, type, decay) {
  partialAmplitudes = [1];
  for (let i = 0; i < 3; i++) {
    osc[i] = actx.createOscillator();
    console.log(osc);
  }
}
*/

// ********************************************************** \\
// ****************** The Voice of chatGPT ****************** \\
// ********************************************************** \\
// create nodes
// const input = actx.createGain();
// const output = actx.createGain();
// const speakers = actx.destination; // connect to mainVol recording node if available
// const modalFilters = [];
// const modalGain = [];
// const modalExciters = [];

// // create modal filter bank
// for (let i = 0; i < 88; i++) {
//   // const f0 = 27.5 * Math.pow(2, (i - 21) / 12);
//   const f0 = 27.5 * Math.pow(2, i / 12); // dump midi-note ref (-21)
//   console.log("idx:", i, "f0:", f0);
//   const modalFilter = actx.createBiquadFilter();
//   modalFilter.type = "bandpass";
//   modalFilter.frequency.value = f0;
//   modalFilters.push(modalFilter);

//   // console.log("modalFilters", modalFilters);
// }

// // create modal gain nodes
// for (let i = 0; i < 88; i++) {
//   const modalGainNode = actx.createGain();
//   modalGainNode.gain.value = 0.0;
//   modalGain.push(modalGainNode);
// }

// // create modal exciter nodes
// for (let i = 0; i < 88; i++) {
//   const modalExciter = actx.createGain();
//   modalExciter.gain.value = 0.0;
//   modalExciters.push(modalExciter);
// }

// // connect nodes
// // input.connect(modalExciters[0]); // WHY???
// for (let i = 0; i < 88; i++) {
//   modalExciters[i].connect(modalFilters[i]);
//   modalFilters[i].connect(modalGain[i]);
//   modalGain[i].connect(output);
//   if (mainVol) {
//     output.connect(mainVol);
//   } else {
//     output.connect(speakers);
//   }
// }

// // set parameters
// for (let i = 0; i < 88; i++) {
//   const q = 20; // how fast the osc vibration is dampend
//   // lower number = faster damping
//   // const f0 = 27.5 * Math.pow(2, (i - 21) / 12); // why is this here?
//   modalFilters[i].Q.value = q;
//   modalExciters[i].gain.value = 1.0;
//   console.log("createOsc8 running");
//   // chatGPT content of `triggerNote()` function goes here
//   //why `note` - 21?
//   /* The line `const i = note - 21;` is part of a function that converts a MIDI note number to a frequency in hertz. The reason for subtracting 21 from the MIDI note number is to account for the fact that the lowest note on a standard 88-key piano is A0, which has a MIDI note number of 21.

// By subtracting 21 from the MIDI note number, we shift the range of MIDI note numbers down so that A0 maps to an index of 0 in the `frequencies` array. This is necessary because the `frequencies` array contains the frequencies of all the notes on a piano from A0 to C8, and we want to be able to look up the frequency of any note in that range using its MIDI note number as an index into the array.
//   */

//   // need to remove all references to midi note number and
//   // pass in the actual frequency instead
//   // in `triggerNote(note)` the midi-note number is passed
//   // in to the function which is then mapped to the index No.
//   // of the relevant arrays.
//   // So, what do we want to do?
//   // well A0 should be mapped to index No. 0 and C8 to idx No. 87
//   // A0 = freq 27.5 mapped to idx No. 0
//   // i.e. freq maps to the indexOf freq in the `modalFilters` array

//   // Note: we need to find the index No. of the incoming `freq`
//   // that is; its index in the `modalFliters` array. The problem
//   // is that the incoming frequency value is only similar to the
//   // its equivalent frequency value in the modalFilters array.
//   // e.g:
//   // 261.6255653005986 // freq-in originating in `scale` array (made by me)
//   // 261.6255798339844 // freq-in originating from `modalFilters` array (made by chatGPT)

//   // So! We are just going to compare the integer parts of the values.
//   // Get the integer part of the incoming frequency so that
//   // we can compare it to the integer part of the frequency
//   // held in the `modalFilters` array

//   // using a bitwise operation.
//   const intOfFreq = freq | 0; // returns integer part of a number
//   // const intOfFreq = 123.456 | 0; // returns 123

//   // modalFilters.indexOf(
//   //   modalFilters.find((o) => o.frequency.value === freq)
//   // );

//   // We could transform the number to a string in order to
//   // get the integer part:
//   // let fString = freq.toString();
//   // console.log(i, freq, fString.split("."));

//   // BUT! There is a quicker way:
//   // console.log("integer part of `freq`", freq | 0 )

//   // array to hold our frequency integers
//   const arrayOfFreqIntegers = [];

//   // all this because we (chatGPT) were only passing in the midi-note number
//   // not the frequency value
//   // const i = note - 21; // eliminate this
//   let i; // var to hold the idx of the frequency

//   // push the integers into the array
//   for (let j = 0; j < 88; j++) {
//     arrayOfFreqIntegers.push(modalFilters[j].frequency.value | 0);

//     // we have to ush the int values to a new array because we
//     // can't compare the result of the bitwise operation
//     // like we would like to below
//     // if (modalFilters[j].frequency.value | 0 === intOfFreq) i = j;
//     if (modalFilters[j])
//       if (arrayOfFreqIntegers[j] === intOfFreq) {
//         i = j;
//         console.log("idx of freq:", i);
//         console.log("arrayOfFreqIntegers:", arrayOfFreqIntegers);
//       }
//   }

//   const vel = 1.0; // loudness
//   modalGain[i].gain.cancelScheduledValues(0);
//   modalGain[i].gain.setValueAtTime(0.0, actx.currentTime);
//   modalGain[i].gain.linearRampToValueAtTime(vel, actx.currentTime + 0.05); // need to change this?
//   modalGain[i].gain.linearRampToValueAtTime(0.0, actx.currentTime + 1.0); // change currrent time to decay
//   modalExciters[i].gain.cancelScheduledValues(0);
//   modalExciters[i].gain.setValueAtTime(0.0, actx.currentTime);
//   modalExciters[i].gain.linearRampToValueAtTime(vel, actx.currentTime + 0.001);
//   modalExciters[i].gain.linearRampToValueAtTime(0.0, actx.currentTime + 1.0); // change currrent time to decay

//   // why `note` -49? lol! should be 69! chatGPT has flaws!
//   // const frequency = 27.5 * Math.pow(2, (note - 49) / 12);
//   // calculate the frequency of the midi note number
//   // NOTE: A4 is midi note 69 and is the reference point
//   // of all other notes
//   // const frequency = 27.5 * Math.pow(2, (note - 69) / 12); // not needed
//   const osc = actx.createOscillator();
//   osc.frequency.setValueAtTime(freq, actx.currentTime);
//   osc.frequency.value = freq;
//   osc.type = type;
//   osc.start();
//   osc.stop(actx.currentTime + 1.0); // handle with keyup listener

//   // osc.connect(modalFilters[i]); // remove
//   // copy the osc to the runningOscs object
//   runningOscs[freq] = osc;
//   runningOscs[freq].connect(modalFilters[i]);
// }

// function createOsc8_HOLD(freq = 440, type, decay) {
//   //why `note` - 21?
//   /* The line `const i = note - 21;` is part of a function that converts a MIDI note number to a frequency in hertz. The reason for subtracting 21 from the MIDI note number is to account for the fact that the lowest note on a standard 88-key piano is A0, which has a MIDI note number of 21.

// By subtracting 21 from the MIDI note number, we shift the range of MIDI note numbers down so that A0 maps to an index of 0 in the `frequencies` array. This is necessary because the `frequencies` array contains the frequencies of all the notes on a piano from A0 to C8, and we want to be able to look up the frequency of any note in that range using its MIDI note number as an index into the array.
//   */
//   const intOfFreq = freq | 0; // returns integer part of a number
//   // array to hold our frequency integers
//   const arrayOfFreqIntegers = [];

//   // const i = note - 21; // remove this midi-note ref
//   let i;

//   // push the integers into the array
//   for (let j = 0; j < 88; j++) {
//     arrayOfFreqIntegers.push(modalFilters[j].frequency.value | 0);

//     // we have to ush the int values to a new array because we
//     // can't compare the result of the bitwise operation
//     // like we would like to below
//     // if (modalFilters[j].frequency.value | 0 === intOfFreq) i = j;

//     if (arrayOfFreqIntegers[j] === intOfFreq) {
//       i = j;
//       //   console.log("idx of freq:", i);
//       //   console.log("arrayOfFreqIntegers:", arrayOfFreqIntegers);
//       // return;
//     }
//   }

//   const vel = 1.0; // loudness
//   modalGain[i].gain.cancelScheduledValues(0);
//   modalGain[i].gain.setValueAtTime(0.0, actx.currentTime);
//   modalGain[i].gain.linearRampToValueAtTime(vel, actx.currentTime + 0.05);
//   modalGain[i].gain.linearRampToValueAtTime(0.0, actx.currentTime + decay);
//   modalExciters[i].gain.cancelScheduledValues(0);
//   modalExciters[i].gain.setValueAtTime(0.0, actx.currentTime);
//   modalExciters[i].gain.linearRampToValueAtTime(vel, actx.currentTime + 0.001);
//   modalExciters[i].gain.linearRampToValueAtTime(0.0, actx.currentTime + decay);

//   // why `note` -49? lol! should be 69! chatGPT has flaws!
//   // const frequency = 27.5 * Math.pow(2, (note - 49) / 12);
//   // calculate the frequency of the midi note number
//   // NOTE: A4 is midi note 69 and is the reference point
//   // of all other notes
//   // const frequency = 27.5 * Math.pow(2, (note - 69) / 12);
//   // const frequency = freq;
//   const osc = actx.createOscillator();
//   osc.frequency.setValueAtTime(freq, actx.currentTime);
//   osc.type = type;
//   osc.start();
//   // osc.stop(actx.currentTime + 1.0);

//   // osc.connect(modalFilters[i]); // remove
//   // copy the osc to the runningOscs object
//   runningOscs[freq] = osc;
//   runningOscs[freq].connect(modalFilters[i]);
// }

// This function creates soft sounding oscilators that use compressors and ramps
// to take the volume down to zero in order to help eleminate those ugly "clicks"
// Implementing chatGPT into a known working
// "click-free" voice

// The Voice of chatGPT
function createOsc8(freq, type = "sine", decay) {
  console.log(freq, type, decay);

  // create oscillator node
  const osc = actx.createOscillator();

  // default destination
  const speakers = actx.destination;

  // create the nodes used by chatGPT
  const modalGain = actx.createGain();
  const modalFilter = actx.createBiquadFilter();
  const modalExciter = actx.createGain();

  // and set the parameters
  modalFilter.Q.value = 20; // how fast the osc vibration is dampend
  // lower value = faster damping

  modalExciter.gain.value = 1.0;

  modalGain.gain.value = 0.0;

  // set the supplied values for the osc
  osc.frequency.value = freq;
  osc.type = type;

  // copy the osc to the runningOscs object
  runningOscs[freq] = osc;

  // Now, do we have a recording facility set up for us in the global scope?
  // If we do, let's connect our audio graph to it so that we can record
  // our live music directly from the audio nodes, rather than a microphone :->
  // All we need to do is connect our last node to the `mainVol` node
  // defined in the global scope
  if (mainVol) {
    // Let's get connected!!!!
    runningOscs[freq]
      .connect(modalGain)
      .connect(modalExciter)
      .connect(modalFilter)
      .connect(mainVol);
  } else {
    //create the audio graph
    runningOscs[freq]
      .connect(modalGain)
      .connect(modalExciter)
      .connect(modalFilter)
      .connect(speakers);
  }

  let vel = 0.5; // loudness

  modalGain.gain.cancelScheduledValues(0);
  modalGain.gain.setValueAtTime(0.0, actx.currentTime);
  modalGain.gain.linearRampToValueAtTime(vel, actx.currentTime + 0.05); // attack

  // Finally ramp down to zero
  modalGain.gain.linearRampToValueAtTime(0, actx.currentTime + decay); // decay

  modalExciter.gain.cancelScheduledValues(0);
  modalExciter.gain.setValueAtTime(0.0, actx.currentTime);
  modalExciter.gain.linearRampToValueAtTime(vel, actx.currentTime + 0.001); // attck
  modalExciter.gain.linearRampToValueAtTime(0.0, actx.currentTime + decay); // decay

  runningOscs[freq].start();
  // osc.stop() handled by `keyup` event listener
}

// ************* Voice Generators END ************ \\

// ************* Keyboard Event Listeners START ************ \\
window.addEventListener("keydown", keyDownHandler, false);
window.addEventListener("keyup", keyupHandler, false);

function keyDownHandler(event) {
  console.log(event);
  // let A = arrayOfAs;
  let key = event.key;
  console.log(key);
  let freq = notes[key];
  // Start recording if the ALT+Z keys are pressed and the
  // recorder's state is not "recording"
  // NOTE!!! Functionallity moved from 'Space' key to the 'ALT' key to
  // avoid problems with focus remaining on the stopBtn after being clicked.
  // event.altKey && key === "Ω" is a fix for
  // Apple Mac OS ALT+Z quirk
  // **** Note startRecording() is defined in recordingChain.js
  if ((event.altKey && key === "z") || (event.altKey && key === "Ω")) {
    if (recorder.state !== "recording") {
      startRecording();
      console.log("media recorder is: ", recorder.state);

      stopBtn.style.backgroundColor = "red";
    }
  }

  if (freq && !runningOscs[freq]) {
    playNote(freq);
    console.log(runningOscs);
  }
}

function keyupHandler(event) {
  const key = event.key;
  const freq = notes[key];

  if (freq && runningOscs3[freq]) {
    // console.log(runningOscs[freq]);
    runningOscs[freq].stop(actx.currentTime + setDecay + 2);
    runningOscs2[freq].stop(actx.currentTime + setDecay + 2);
    runningOscs3[freq].stop(actx.currentTime + setDecay + 2);
    delete runningOscs[freq];
    delete runningOscs2[freq];
    delete runningOscs3[freq];
  } else if (freq && runningOscs2[freq]) {
    // console.log(runningOscs[freq]);
    runningOscs[freq].stop(actx.currentTime + setDecay + 2);
    runningOscs2[freq].stop(actx.currentTime + setDecay + 2);
    delete runningOscs[freq];
    delete runningOscs2[freq];
  } else if (freq && runningOscs[freq]) {
    runningOscs[freq].stop(actx.currentTime + setDecay + 2);
    delete runningOscs[freq];
  }
}
// ************* Keyboard Event Listeners END ************ \\

/* ************* File Upload Handling START ************* */
/*
    Turns out that the file `type` property just reads the
    file extension to give the file type, which is PANTS

    So we're gonna have to look at the first four bytes
    in the actual file to establish what it is ugh!

    Easy is not secure ======================== is true!
*/

/* ****** show the upload file details in the GUI ****** */
const selectedFile = document.getElementById("fileupload"); // Input tag for file upload

const fileSizeTag = document.getElementById("fileSize"); // span to write size
const fileTypeTag = document.getElementById("fileType"); // span to write type
const hexTag = document.getElementById("hexTag"); // span to write magic numbers
const uploadBtn = document.getElementById("uploadBtn"); // UPLOAD BUTTON!!!!!

selectedFile.addEventListener("change", handleChange, false);

function handleChange(e) {
  const file = selectedFile.files[0];
  const sizeLimit = 1024 * 4000;

  const disableBtn = () => {
    uploadBtn.setAttribute("aria-disabled", "true");
    uploadBtn.innerHTML = "DISABLED";
  };

  const enableBtn = () => {
    uploadBtn.setAttribute("aria-disabled", "false");
    uploadBtn.innerHTML = "upload";
  };

  // ****** Lets Read the Bytes ****** \\
  // Magic Numbers = first four bytes of the file
  // Start a timer to track how long the operation takes
  // Syntax `.time("UniqueNameOfTimer")`
  console.time("FileOpen");

  // create a  new `FileReader` instance
  const fileReader = new FileReader();

  fileReader.onloadend = (e) => {
    if (e.target.readyState === FileReader.DONE) {
      const uInt8 = new Uint8Array(e.target.result);
      console.log("uInt8", uInt8);
      let bytes = [];
      uInt8.forEach((byte) => {
        console.log(byte.toString(16));
        bytes.push(byte.toString(16));
        console.log("bytes: ", bytes);
      });

      const hex = bytes.join("").toUpperCase();

      // ****** Test File OK To Upload ****** \\
      console.log(typeof hex, hex);
      console.log(getMimetype(hex) === "audio/wav", file.size <= sizeLimit);
      if (getMimetype(hex) === "audio/wav" && file.size <= sizeLimit) {
        console.log("upload enabled");
        enableBtn();
      } else {
        console.log("upload disabled");
        disableBtn();
      }

      // ****** Write to the GUI ****** \\
      fileSizeTag.innerHTML = Math.ceil(file.size / 1024, " KB");
      fileTypeTag.innerHTML = getMimetype(hex);

      // End the timer
      console.timeEnd("FileOpen");
    }
  };

  const blob = file.slice(0, 4);
  fileReader.readAsArrayBuffer(blob);
}

// Define audio files for validation and info for GUI
function getMimetype(signature) {
  switch (signature) {
    case "52494646":
      return "audio/wav";
    case "4F676753":
      return "audio/ogg";
  }
}

console.log(getMimetype("52494646"));

/* ************* File Upload Handling END ************* */
