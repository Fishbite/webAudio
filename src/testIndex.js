console.log("testIndex.js");

// get the range slider and label from the document
const slider = document.getElementById("slider");
const labelVal = document.getElementById("label");

// var to hold the value of the slider
// We'll use this as the index value later
let oct = 2;

// add an event listener to the slider
window.addEventListener("change", handelChange, false);

// the change event handler
function handelChange(event) {
  // set the value of var oct to the slider value
  oct = parseFloat(slider.value);
  console.log(oct);

  // set the label content to equal var `oct`
  labelVal.innerHTML = oct;

  return oct;
}

// Create the audio context
const actx = new AudioContext();

// function to call `function createOsc(freq)`
function playNote(freq) {
  ceateOsc(freq);
}

// function to create an audio graph that
// start and stops the oscillator
function ceateOsc(freq) {
  // create the audio nodes
  const osc = actx.createOscillator();
  const vol = actx.createGain();

  // set the nodes values
  osc.frequency.value = freq;
  vol.gain.value = 0.1;

  // connect the nodes to the audio context destintion
  osc.connect(vol).connect(actx.destination);

  // start & stop the oscillator
  osc.start();
  osc.stop(actx.currentTime + 1);
}

// array of objects holding musical note frequencies
let scale = [
  {
    A: 110,
  },
  {
    A: 220,
  },
  {
    A: 440,
  },
  {
    A: 880,
  },
];

// map keyboard to notes using var `oct`
// for the index number of array `scale`
const notes = {
  // scale[0].A should undefined
  // scale[1].A should undefined
  // scale[2].A should return 440
  // scale[3].A should return 880
  get y() {
    return scale[oct].A;
  },
};

// ************* Listen For Keyboard Input START ************ \\
window.addEventListener("keydown", keydownHandler, false);

function keydownHandler(event) {
  const key = event.key;
  const freq = notes[key];
  console.log("oct val", oct, "frequency", freq);
  // if our notes object has this keyboard key defined
  // play the note:
  if (freq) {
    playNote(freq);
  } else {
    console.log("Only key 'Y' can play a note");
  }
}
// ************* Listen For Keyboard Input END ************ \\

/* ****** Backup Copies ****** */
// const scale = [
//     {},
//     {},
//     {
//       A: 440,
// As: 466.1637615180899,
// B: 493.8833012561241,
// C: 261.6255653005986,
// Cs: 277.1826309768721,
// D: 293.6647679174076,
// Ds: 311.12698372208087,
// E: 329.6275569128699,
// F: 349.2282314330039,
// Fs: 369.9944227116344,
// G: 391.99543598174927,
// Gs: 415.3046975799451,
// },
// {
//   A: 880,
// As: 932.3275230361799,
// B: 987.7666025122483,
// C: 523.2511306011972,
// Cs: 554.3652619537442,
// D: 587.3295358348151,
// Ds: 622.2539674441617,
// E: 659.2551138257398,
// F: 698.4564628660078,
// Fs: 739.9888454232688,
// G: 783.9908719634985,
// Gs: 830.6093951598903,
//     },
//   ];
/* ****** Musical Notes END ****** */

/* ****** Keyboard Map to Musical Notes ****** */
//   const notes = {
//   q: scale[oct].C,
//   2: scale[oct].Cs,
//   w: scale[oct].D,
//   3: scale[oct].Ds,
//   e: scale[oct].E,
//   r: scale[oct].F,
//   5: scale[oct].Fs,
//   t: scale[oct].G,
//   6: scale[oct].Gs,
// y: scale[oct].A,
//   7: scale[oct].As,
//   u: scale[oct].B,
//   //   i: scale[oct + 1].C,
//   //   9: scale[oct + 1].Cs,
//   //   o: scale[oct + 1].D,
//   //   0: scale[oct + 1].Ds,
//   //   p: scale[oct + 1].E,
//   };
/* ****** Musical Notes END ****** */
