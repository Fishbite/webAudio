console.log("Connected to the moon!");

// Get the control stuff from the document
const waveTypeValue = document.getElementById("waveTypeValue"); // wave form slider
const waveTypeLabel = document.getElementById("waveTypeLabel");
const decayTimeValue = document.getElementById("decayTimeValue"); // decay time slider
const decayTimeLabel = document.getElementById("decayTimeLabel");
console.log(decayTimeLabel, decayTimeValue);

// create the context
const actx = new AudioContext();

// ************* Live Output Recording Setup START ************ \\
// Create the things we need to reocord live output from
// our music generators
// Connect your audio graphs to this `mainVol` node
let mainVol = actx.createGain(),
  // create a media stream destination
  streamDest = actx.createMediaStreamDestination(),
  // create a recorder and connect it to the stream
  recorder = new MediaRecorder(streamDest.stream),
  // Get our audio element from the document
  audioTag = document.getElementById("audioTag"),
  // Get our stop button
  stopBtn = document.getElementById("stopBtn"),
  recordingStopped = false;

// now connect the above
// We just need to connect our audio graphs to the
// mainVol node in our sound generators
mainVol.connect(streamDest);
mainVol.connect(actx.destination);

// Start and stop the recorder
function startRecording() {
  if (recorder.state !== "recording") {
    recorder.start();

    stopBtn.setAttribute("aria-disabled", "false");
    stopBtn.innerHTML = "__Stop__Recording__";
    stopBtn.style.color = "var(--clr-silver-2)";
    stopBtn.style.backgroundColor = "var(--clr-green-1)";
  }
}

function stopRecording() {
  recorder.ondataavailable = function (e) {
    // Set the audioTag html element source to the Blob
    audioTag.src = URL.createObjectURL(e.data);
    // console.log(e.data, audioTag.src);
  };

  recorder.stop();

  stopBtn.setAttribute("aria-disabled", "true");
  stopBtn.innerHTML = "_Recording_Stopped_";
  stopBtn.style.backgroundColor = "var(--clr-red-1)";
}

// attach event listener to the stop button
stopBtn.addEventListener("click", (e) => {
  console.log("stopBtn clicked");

  if (recorder.state === "recording") {
    stopRecording();
    console.log(recorder.state);
  }
});

// ************* Live Output Recording Setup END ************ \\

// ************* Musical Note Generators START ************ \\
// Set The Wave Type From User Input
// For keys in general

// For the range slider to select wave type
waveTypeValue.addEventListener("change", updateWaveType);

const waveType = ["sine", "triangle", "square", "sawtooth"];
decayTimeValue.addEventListener("change", updateDecay, false);

let setWave,
  setDecay = 2;

function updateWaveType(e) {
  setWave = waveType[waveTypeValue.value];
  waveTypeLabel.innerHTML = setWave;
  return setWave;
}

function updateDecay(e) {
  setDecay = parseFloat(decayTimeValue.value);
  decayTimeLabel.innerHTML = setDecay;
  return setDecay;
}

// This function just sets default values for oscillator values
// then runs the create oscillator function
let decay = setDecay;
function playNote(freq = 261.63, type = setWave, decay = setDecay) {
  // Create a new oscillator and audio graph for each keypress
  createOsc(freq, type, decay);
}

// An object to hold running oscillators
const runningOscs = {};

// This function creates soft sounding oscilators that use compressors and ramps
// to take the volume down to zero in order to help eleminate those ugly "clicks"
// We are recording these better sounds
function createOsc(freq, type, decay) {
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
  console.log(runningOscs[freq]);

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

// ************* Musical Note Generators END ************ \\

// ************* Variables to Hold Musical Notes START ************ \\
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
// console.log(octave.build());

const A4 = 440;
let scale = [];

for (let i = -4; i < 4; i++) {
  let a = A4 * Math.pow(2, i);
  let octave = new Octave(a);

  scale.push(octave);
}

console.log("An array of scales", scale);
// console.log(scale[4].C);

// map of keyboard keys to notes in array scale
const notes = {
  q: scale[4].C,
  2: scale[4].Cs,
  w: scale[4].D,
  3: scale[4].Ds,
  e: scale[4].E,
  r: scale[4].F,
  5: scale[4].Fs,
  t: scale[4].G,
  6: scale[4].Gs,
  y: scale[4].A,
  7: scale[4].As,
  u: scale[4].B,
  i: scale[5].C,
  9: scale[5].Cs,
  o: scale[5].D,
  0: scale[5].Ds,
  p: scale[5].E,
};
// console.log(notes["y"]);

// ************* Variables to Hold Musical Notes END ************ \\

// ************* Keyboard Controls START ************ \\
window.addEventListener("keydown", keyDownHandler, false);
window, addEventListener("keyup", keyupHandler, false);

function keyDownHandler(event) {
  // let A = arrayOfAs;
  let key = event.key;
  let freq = notes[key];
  console.log(key, runningOscs);
  // Start recording if the 'Space' key is pressed and the
  // recorder's state is not "recording"
  // NOTE!!! Functionallity moved from 'Space' key to the 'Control' key to
  // avoid problems with focus remaining on the stopBtn after being clicked.
  if (event.ctrlKey && key === "z") {
    if (recorder.state !== "recording") {
      startRecording();
      console.log(recorder.state);
    }
  }

  if (freq && !runningOscs[freq]) {
    playNote(freq);
    console.log(freq, runningOscs[freq]);
  }
}

function keyupHandler(event) {
  const key = event.key;
  const freq = notes[key];
  if (freq && runningOscs[freq]) {
    console.log(runningOscs);
    runningOscs[freq].stop(actx.currentTime + decay + 2);
    delete runningOscs[freq];
  }
}
// ************* Keyboard Controls END ************ \\
