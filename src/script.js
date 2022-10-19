console.log("Connected to the moon!");

/* // ****** LICENSE NOTICE ****** \\
      COPYRIGHT: 2022 Stuart Peel 
      This PROGRAM is distributed under the terms of the:
      AGPL-3.0-or-later
*/

/*
  The file computes note frequencies and sets up the keyboard
  to play musical notes as heard on electronic keyboard & pianos.

  Connection to the user interface is also established in here. That
  gives the user the ability to change some attributes of the notes:

    * Decay - the duration of the note/s to be played

    * Wave Form - sine, traingle, square & sawtooth

    * Octave value - to give facilitate the full range of notes
      from octave 0 through to octave 7

    * voicePicker - select voices from a dropdown list

*/

// ************* GUI Slider Controls START ************ \\
// Get the slider control elements from the document
const waveTypeValue = document.getElementById("waveTypeValue"); // wave form slider
const waveTypeLabel = document.getElementById("waveTypeLabel");
const decayTimeValue = document.getElementById("decayTimeValue"); // decay time slider
const decayTimeLabel = document.getElementById("decayTimeLabel");
const octaveValue = document.getElementById("octaveValue"); // octave value slider
const octaveValueLabel = document.getElementById("octaveValueLabel");

// For the range slider to select wave type
waveTypeValue.addEventListener("change", updateWaveType);

const waveType = ["sine", "triangle", "square", "sawtooth"];
decayTimeValue.addEventListener("change", updateDecay, false);

octaveValue.addEventListener("change", updateOctaveValue, false);

let setWave,
  setDecay = 2,
  octaveCurrent = 4;

function updateWaveType(e) {
  setWave = waveType[waveTypeValue.value];
  waveTypeLabel.innerHTML = setWave.slice(0, 3);
  return setWave;
}

function updateDecay(e) {
  setDecay = parseFloat(decayTimeValue.value);

  decayTimeLabel.innerHTML = setDecay;
  return setDecay;
}

function updateOctaveValue(e) {
  octaveCurrent = parseFloat(octaveValue.value);

  octaveValueLabel.innerHTML = octaveCurrent;
  console.log("`octaveCurrent` value:", octaveCurrent);

  console.log("octaveCurrent has been set:", octaveCurrent);
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

// ************* Musical Note Generators START ************ \\
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
    createOsc6(freq, type, decay); // experimental
  }
}

// An object to hold running oscillators
const runningOscs = {};
const runningOscs2 = {};

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

// Thanks to Rex van der Spur's book:
// Advanced Game Design with HTML5 & JavaScript
function impulseResponse(duration = 2, decay = 2, reverse = true) {
  this.duration = duration;
  this.decay = decay;
  this.reverse = reverse;
  console.log(this, this.duration);
  //The length of the buffer
  //(The AudioContext's default sample rate is 44100)
  let length = actx.sampleRate * duration;
  //Create an audio buffer (an empty sound container) to store the reverb effect
  let impulse = actx.createBuffer(2, length, actx.sampleRate);
  //Use `getChannelData` to initialize empty arrays to store sound data for
  //the left and right channels
  let left = impulse.getChannelData(0),
    right = impulse.getChannelData(1);
  //Loop through each sample-frame and fill the channel
  //data with random noise
  for (let i = 0; i < length; i++) {
    //Apply the reverse effect, if `reverse` is `true`
    let n;
    if (reverse) {
      n = length - i;
    } else {
      n = i;
    }
    //Fill the left and right channels with random white noise that
    //decays exponentially
    left[i] = (Math.random() * 2 - 1) * Math.pow(1 - n / length, decay);
    right[i] = (Math.random() * 2 - 1) * Math.pow(1 - n / length, decay);
  }
  //Return the `impulse`
  return impulse;
}

// **** this has problems ****
function createOsc3(freq, type = "sine", decay) {
  console.log(freq, type, decay);

  // create oscillator, gain and compressor nodes
  let osc = actx.createOscillator();
  let osc2 = actx.createOscillator();
  let vol = actx.createGain();
  let convolver = actx.createConvolver();
  let compressor = actx.createDynamicsCompressor();

  // set the supplied values
  osc.frequency.value = freq;
  osc2.frequency.value = freq - 1;
  osc.type = "sawtooth";
  osc2.type = "triangle";
  convolver.buffer = impulseResponse();
  console.log(convolver.buffer);

  // copy the osc to the runningOscs object
  runningOscs[freq] = osc;
  runningOscs2[freq] = osc2;
  // console.log(runningOscs[freq]);

  // set the volume value so that we do not overload the destination
  // when multiple voices are played simmultaneously
  if (this.reverse === false) vol.gain.value = 0.1;
  if (this.reverse === true) vol.gain.value = 10;

  // Now, do we have a recording facility set up for us in the global scope?
  // If we do, let's connect our audio graph to it so that we can record
  // our live music directly from the audio nodes, rather than a microphone :->
  // All we need to do is connect our compressor node to the `mainVol` node
  // defined in the global scope
  if (mainVol) {
    // Let's get connected!!!!
    runningOscs[freq]
      .connect(convolver)
      .connect(vol)
      .connect(compressor)
      .connect(mainVol);
    runningOscs2[freq]
      .connect(convolver)
      .connect(vol)
      .connect(compressor)
      .connect(mainVol);
  } else {
    // change `else` to `if (!mianVol) {}`
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
// **** voice = experimental ****
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
  distortionNode.curve = makeDistortionCurve(400);

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
  distortionVol.gain.value = 1;

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
    vol
      .connect(distortionNode)
      .connect(distortionVol)
      .connect(compressor)
      .connect(mainVol);

    // vol.connect(mainVol);
  } else {
    //create the audio graph
    runningOscs[freq].connect(volOsc).connect(vol);
    runningOscs2[freq].connect(volOsc2).connect(vol);
    // commented out to find cause of volume prolem with distortion
    // vol.connect(reverb).connect(distortionNode).connect(actx.destination);
    vol
      .connect(reverb2)
      .connect(distortionNode)
      .connect(distortionVol)
      .connect(compressor)
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
// ************* Musical Note Generators END ************ \\

// ************* The Musical Notes Bit! START ************ \\
// Some musical note values:
// let C4 = 261.63,
//   D4 = 293.66,
//   E4 = 329.63,
//   F4 = 349.23,
//   G4 = 392,
//   A4 = 440,
//   B4 = 493.88,
//   C5 = 523.25,
//   D5 = 587.33,
//   E5 = 659.25;

// let's calculate the notes instead of hard coding them:
// All the A's A0 to A7
// const A = [];
// for (let i = -4; i < 4; i++) {
//   // multiplying A4 by (a number multiplied by a negative power)
//   // is the same as dividing A4 by a number with a positive power
//   let a = A4 * Math.pow(2, i);

//   A.push(a);
//   // console.log(arrayOfAs.indexOf(a), a);
// }

// for (let i = 0; i < A.length; i++) {
//   let val = A[i];
//   // output the actual index of `val` & its value
//   console.log(A.indexOf(val), val);
// }

// Now we need the octave to fill in the notes between A's

/* Formula to Calculate The Frequencies of Notes of
   The Even Tempered Scale:

   Fn = Fo * (a)^n

   Where Fo = A4 = 440Hz

         n = the number of half steps away from A4
             For notes higher than A4 n is positve
             else lower notes, n is negative

         Fn = the frequency of the note in half steps

         a = (2)^1/12 = 12th root of 2, which is the number which when multiplied by itelf 12 times equals 2 = 1.059463....

    e.g. C5 is 3/12 steps away from A4, thus:

            C5 = Fn = Fo * (a)^n
               = 3/12 steps = 440 * ((2)^1/12)^3 = 523.26...Hz

         C4 is -9/12 steps away from A4, thus:

            C4 = Fn = Fo * (a)^n
               = -9/12 steps = 440 * ((2)^1/12)^-9 = 261.63...Hz

*/

// Class to define an Octave template
class Octave {
  constructor(a) {
    this.C = a * Math.pow(2, -9 / 12);
    this.Cs = a * Math.pow(2, -8 / 12);
    this.D = a * Math.pow(2, -7 / 12);
    this.Ds = a * Math.pow(2, -6 / 12);
    this.E = a * Math.pow(2, -5 / 12);
    this.F = a * Math.pow(2, -4 / 12);
    this.Fs = a * Math.pow(2, -3 / 12);
    this.G = a * Math.pow(2, -2 / 12);
    this.Gs = a * Math.pow(2, -1 / 12);
    this.A = a;
    this.As = a * Math.pow(2, 1 / 12);
    this.B = a * Math.pow(2, 2 / 12);
  }
  // build() {
  //   for (let note in this) {
  //     console.log("Note:", note, this[note]);
  //   }
  // }
}

// let octave = new Octave(440);
// console.log(Octave.build);

const A4 = 440; // frequency in Hz
let scale = []; // Array to hold all octaves

// Create each octave and push it to the `scale` array
for (let i = -4; i < 4; i++) {
  let a = A4 * Math.pow(2, i);
  let octave = new Octave(a);

  scale.push(octave);
}

// console.log(scale[4].C);
console.log(scale);

// ************* The Musical Notes Bit! END ************ \\

// ************* Keyboard Keys That Play Notes: START ************ \\
// map of keyboard keys to notes in array scale
const notes = {
  // q: scale[octaveCurrent].C,
  // Use getter functions so that the
  // current value of `octaveCurrent` is read
  get q() {
    console.log(`C${octaveCurrent}`);
    return scale[octaveCurrent].C;
  },
  // 2: scale[octaveCurrent].Cs,
  get 2() {
    console.log(`C${octaveCurrent}#`);
    return scale[octaveCurrent].Cs;
  },
  // w: scale[octaveCurrent].D,
  get w() {
    console.log(`D${octaveCurrent}`);
    return scale[octaveCurrent].D;
  },
  // 3: scale[octaveCurrent].Ds,
  get 3() {
    console.log(`D${octaveCurrent}#`);
    return scale[octaveCurrent].Ds;
  },
  // e: scale[octaveCurrent].E,
  get e() {
    console.log(`E${octaveCurrent}`);
    return scale[octaveCurrent].E;
  },
  // r: scale[octaveCurrent].F,
  get r() {
    console.log(`F${octaveCurrent}`);
    return scale[octaveCurrent].F;
  },
  // 5: scale[octaveCurrent].Fs,
  get 5() {
    console.log(`F${octaveCurrent}#`);
    return scale[octaveCurrent].Fs;
  },
  // t: scale[octaveCurrent].G,
  get t() {
    console.log(`G${octaveCurrent}`);
    return scale[octaveCurrent].G;
  },
  // 6: scale[octaveCurrent].Gs,
  get 6() {
    console.log(`G${octaveCurrent}#`);
    return scale[octaveCurrent].Gs;
  },
  get y() {
    console.log(`A${octaveCurrent}`);
    return scale[octaveCurrent].A;
  },
  // 7: scale[octaveCurrent].As,
  get 7() {
    console.log(`A${octaveCurrent}#`);
    return scale[octaveCurrent].As;
  },
  // u: scale[octaveCurrent].B,
  get u() {
    console.log(`B${octaveCurrent}`);
    return scale[octaveCurrent].B;
  },
  // i: scale[octaveCurrent + 1].C,
  get i() {
    console.log(`C${octaveCurrent + 1}`);
    if (scale[octaveCurrent + 1]) return scale[octaveCurrent + 1].C;
  },
  // 9: scale[octaveCurrent + 1].Cs,
  get 9() {
    console.log(`C${octaveCurrent + 1}#`);
    if (scale[octaveCurrent + 1]) return scale[octaveCurrent + 1].Cs;
  },
  // o: scale[octaveCurrent + 1].D,
  get o() {
    console.log(`D${octaveCurrent + 1}`);
    if (scale[octaveCurrent + 1]) return scale[octaveCurrent + 1].D;
  },
  // 0: scale[octaveCurrent + 1].Ds,
  get 0() {
    console.log(`D${octaveCurrent + 1}#`);
    if (scale[octaveCurrent + 1]) return scale[octaveCurrent + 1].Ds;
  },
  // p: scale[octaveCurrent + 1].E,
  get p() {
    console.log(`E${octaveCurrent + 1}`);
    if (scale[octaveCurrent + 1]) return scale[octaveCurrent + 1].E;
  },
};

// ************* Keyboard Keys That Play Notes: END ************ \\

// ************* Keyboard Event Listeners START ************ \\
window.addEventListener("keydown", keyDownHandler, false);
window, addEventListener("keyup", keyupHandler, false);

function keyDownHandler(event) {
  // let A = arrayOfAs;
  let key = event.key;
  let freq = notes[key];
  // Start recording if the ALT+Z keys are pressed and the
  // recorder's state is not "recording"
  // NOTE!!! Functionallity moved from 'Space' key to the 'ALT' key to
  // avoid problems with focus remaining on the stopBtn after being clicked.
  if (event.altKey && key === "z") {
    if (recorder.state !== "recording") {
      startRecording();
      console.log(recorder.state);
    }
  }

  if (freq && !runningOscs[freq]) {
    playNote(freq);
  }
}

function keyupHandler(event) {
  const key = event.key;
  const freq = notes[key];
  if (freq && runningOscs2[freq]) {
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
