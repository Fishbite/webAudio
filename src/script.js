console.log("Connected to the moon!");

// create the context
const actx = new AudioContext();

// ************* Live Output Recording Setup START ************ \\
// Create the things we need to reocord live output from
// our music generators
let mainVol = actx.createGain(),
  // create a media stream destination
  streamDest = actx.createMediaStreamDestination(),
  // create a recorder and connect it to the stream
  recorder = new MediaRecorder(streamDest.stream),
  // Get our audio element from the document
  audioTag = document.getElementById("audioTag"),
  // Get our stop button
  stopBtn = document.getElementById("stopBtn");

// now connect the above
// We just need to connect our audio graphs to the
// mainVol node in our sound generators
mainVol.connect(streamDest);
mainVol.connect(actx.destination);

// Start and stop the recorder
function startRecording() {
  if (recorder.state !== "recording") {
    recorder.start();

    stopBtn.innerHTML = "__Stop__Recording__";
    stopBtn.style.color = "goldenrod";
  }
}

function stopRecording() {
  recorder.ondataavailable = function (e) {
    // Set the audioTag html element source to the Blob
    audioTag.src = URL.createObjectURL(e.data);
    // console.log(e.data, audioTag.src);
  };

  recorder.stop();

  stopBtn.innerHTML = "_Recording_Stopped_";
  stopBtn.style.color = "red";
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

// This function just sets default values for oscillator values
// then runs the create oscillator function
function playNote(freq = 261.63, type = "sine", decay = 1) {
  // Create a new oscillator and audio graph for each keypress
  createOsc(freq, type, decay);
}

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
    osc.connect(vol).connect(compressor).connect(mainVol);
  } else {
    //create the audio graph
    osc.connect(vol).connect(compressor).connect(actx.destination);
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

  osc.start(actx.currentTime);
  osc.stop(actx.currentTime + decay + 0.03);
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
  build() {
    for (let note in this) {
      console.log("Note:", note, this[note]);
    }
  }
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

// console.log("An array of scales", scale);
// console.log(scale[4].C);

// ************* Variables to Hold Musical Notes END ************ \\

// ************* Keyboard Controls START ************ \\
window.addEventListener("keydown", keyDownHandler, false);

function keyDownHandler(event) {
  // let A = arrayOfAs;
  let key = event.key;
  // Start recording if the 'Space' key is pressed and the
  // recorder's state is not "recording"
  // console.log(event.code, recorder.state, event);
  if (key == " ") {
    if (recorder.state !== "recording") {
      startRecording();
      console.log(recorder.state);
    }
  }

  let s4 = scale[4],
    s5 = scale[5];
  // Musical notes
  if (key === "q") playNote(s4.C);
  if (key === "2") playNote(s4.Cs);
  if (key === "w") playNote(s4.D);
  if (key === "3") playNote(s4.Ds);
  if (key === "e") playNote(s4.E);
  if (key === "r") playNote(s4.F);
  if (key === "5") playNote(s4.Fs);
  if (key === "t") playNote(s4.G);
  if (key === "6") playNote(s4.Gs);
  if (key === "y") playNote(s4.A);
  if (key === "7") playNote(s4.As);
  if (key === "u") playNote(s4.B);
  if (key === "i") playNote(s5.C);
  if (key === "9") playNote(s5.Cs);
  if (key === "o") playNote(s5.D);
  if (key === "0") playNote(s5.Ds);
  if (key === "p") playNote(s5.E);
}
// ************* Keyboard Controls END ************ \\
