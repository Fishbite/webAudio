console.log("chatter, chatter, chatter... :-)");
/*  ****** The Voice of chatGPT ******
    The following code has been created
    using the infamous chatGPT AI entity!
*/

/* The following code creates an audio graph that synthesizes a basic piano sound using a physical modeling technique known as modal synthesis: 

    This implementation creates a bank of bandpass filters that simulate the resonances of a piano string. The filters are excited using gain nodes that simulate the hammer hitting the string. When a note is triggered, the gain and excitation nodes for the corresponding filter are ramped up and then down over a period of 1 second to simulate the decay of the sound.
*/

//  [[[[ ****WE HAVE CHANGED THIS FILE**** ]]]]

// create audio context
const actx = new AudioContext(); // not needed

// create nodes
const input = actx.createGain();
const output = actx.createGain();
const speakers = actx.destination; // connect to mainVol recording node
const modalFilters = [];
const modalGain = [];
const modalExciters = [];

// create modal filter bank
for (let i = 0; i < 88; i++) {
  // const f0 = 27.5 * Math.pow(2, (i - 21) / 12);
  const f0 = 27.5 * Math.pow(2, (i - 21) / 12); // dump midi-note ref (-21)
  console.log("f0:", f0);
  const modalFilter = actx.createBiquadFilter();
  modalFilter.type = "bandpass";
  modalFilter.frequency.value = f0;
  modalFilters.push(modalFilter);
  console.log("modalFilters", modalFilters);
}

// create modal gain nodes
for (let i = 0; i < 88; i++) {
  const modalGainNode = actx.createGain();
  modalGainNode.gain.value = 0.0;
  modalGain.push(modalGainNode);
}

// create modal exciter nodes
for (let i = 0; i < 88; i++) {
  const modalExciter = actx.createGain();
  modalExciter.gain.value = 0.0;
  modalExciters.push(modalExciter);
}

// connect nodes
input.connect(modalExciters[0]);
for (let i = 0; i < 88; i++) {
  modalExciters[i].connect(modalFilters[i]);
  modalFilters[i].connect(modalGain[i]);
  modalGain[i].connect(output);
  output.connect(speakers);
}

// set parameters
for (let i = 0; i < 88; i++) {
  const q = 20; // how fast the osc vibration is dampend
  // lower number = faster damping
  const f0 = 27.5 * Math.pow(2, (i - 21) / 12); // why is this here?
  modalFilters[i].Q.value = q;
  modalExciters[i].gain.value = 1.0;
}

// trigger piano note
// See updated version that actually makes a sound! Hopefully!!!
// function triggerNote(note) {
//   const i = note - 21;
//   const vel = 1.0;
//   modalGain[i].gain.cancelScheduledValues(0);
//   modalGain[i].gain.setValueAtTime(0.0, actx.currentTime);
//   modalGain[i].gain.linearRampToValueAtTime(
//     vel,
//     actx.currentTime + 0.05
//   );
//   modalGain[i].gain.linearRampToValueAtTime(
//     0.0,
//     actx.currentTime + 1.0
//   );
//   modalExciters[i].gain.cancelScheduledValues(0);
//   modalExciters[i].gain.setValueAtTime(0.0, actx.currentTime);
//   modalExciters[i].gain.linearRampToValueAtTime(
//     vel,
//     actx.currentTime + 0.001
//   );
//   modalExciters[i].gain.linearRampToValueAtTime(
//     0.0,
//     actx.currentTime + 1.0
//   );
// }

// Updated `triggerNote` function:
/*
Yes, that is correct. The `triggerNote` function is used to play a note. The `note` parameter specifies which note to play, where `note` is an integer representing the MIDI note number (where middle C is 60). 

When the `triggerNote` function is called, it sets the gain of the corresponding modal exciter node to a value of 1.0, which "excites" the filter bank and creates the initial sound. It then ramps up the gain of the corresponding modal gain node to the desired velocity or loudness of the note, and then ramps it back down over a period of time to simulate the decay of the sound. 

In the updated version, an osc is also created with a frequency corresponding to the MIDI note number and connected to the corresponding bandpass filter in the filter bank. The osc is then started and stopped after a duration of 1 second, to create a simple waveform with the correct frequency to help excite the filter bank.
*/
function triggerNote(note) {
  //why `note` - 21?
  /* The line `const i = note - 21;` is part of a function that converts a MIDI note number to a frequency in hertz. The reason for subtracting 21 from the MIDI note number is to account for the fact that the lowest note on a standard 88-key piano is A0, which has a MIDI note number of 21.

By subtracting 21 from the MIDI note number, we shift the range of MIDI note numbers down so that A0 maps to an index of 0 in the `frequencies` array. This is necessary because the `frequencies` array contains the frequencies of all the notes on a piano from A0 to C8, and we want to be able to look up the frequency of any note in that range using its MIDI note number as an index into the array.
  */
  const i = note - 21;
  const vel = 1.0; // loudness
  modalGain[i].gain.cancelScheduledValues(0);
  modalGain[i].gain.setValueAtTime(0.0, actx.currentTime);
  modalGain[i].gain.linearRampToValueAtTime(vel, actx.currentTime + 0.05);
  modalGain[i].gain.linearRampToValueAtTime(0.0, actx.currentTime + 1.0);

  modalExciters[i].gain.cancelScheduledValues(0);
  modalExciters[i].gain.setValueAtTime(0.0, actx.currentTime);
  modalExciters[i].gain.linearRampToValueAtTime(vel, actx.currentTime + 0.001);
  modalExciters[i].gain.linearRampToValueAtTime(0.0, actx.currentTime + 1.0);

  // why `note` -49? lol! should be 69! chatGPT has flaws!
  // const frequency = 27.5 * Math.pow(2, (note - 49) / 12);
  // calculate the frequency of the midi note number
  // NOTE: A4 is midi note 69 and is the reference point
  // of all other notes
  const frequency = 27.5 * Math.pow(2, (note - 69) / 12);
  const osc = actx.createOscillator();
  osc.frequency.setValueAtTime(frequency, actx.currentTime);
  osc.type = "triangle";
  osc.start();
  osc.stop(actx.currentTime + 1.0);

  osc.connect(modalFilters[i]);
}

/*

You are correct, there are no oscillators in this implementation. The sound is synthesized using a technique known as modal synthesis, which is a type of physical modeling synthesis.

Modal synthesis is based on the idea that the sound of a musical instrument can be modeled as a combination of a set of resonant modes or partials. In the case of a piano, these resonant modes correspond to the different harmonics that are excited when a piano string is struck by a hammer.

In this implementation, the resonant modes are modeled using a bank of bandpass filters. Each filter is tuned to a different frequency corresponding to a different harmonic of the piano string. When a note is triggered, the gain and excitation nodes for the corresponding filter are ramped up and then down over a period of time to simulate the decay of the sound.

By using modal synthesis, we can create a more realistic and nuanced sound than we would get with basic oscillators or simple waveforms.
*/
/*

Yes, the `triggerNote` function is used to play a note. The `note` parameter represents the MIDI note number of the note you want to play. 

In the MIDI standard, each note is assigned a number from 0 to 127, where 60 corresponds to middle C (261.63 Hz). The note parameter passed to the `triggerNote` function should be an integer in the range 21 to 108, which corresponds to the MIDI note numbers for the lowest and highest keys on a standard piano keyboard.

To convert a MIDI note number to a frequency in Hz, you can use the following formula:

```
frequency = 440 * 2^((note - 69)/12)
```

Where `note` is the MIDI note number and `frequency` is the corresponding frequency in Hz. For example, to play middle C (MIDI note number 60), you would call the `triggerNote` function with the argument 60:

```
triggerNote(60);
```

This would play the note middle C (261.63 Hz) on the piano.
*/

// test the function:

document.addEventListener("keydown", playNote, false);

function playNote(e) {
  console.log("keydown", e.keyCode);
  triggerNote(e.keyCode);
}

// No audible sound created as we are not connecting to an
// `actx` destination

// Response from chatGPT:

// notice the introduction of `Piano` which is an undefind class.
// It appears that whne we leave chatGPT alone for a while, day or so,
// it seems to forget where it was. i.e. we were tring to create
// sounds using modal synthesis and that was left completely out of
// the loop when it created the `Piano` class:
/*
class Piano {
  constructor(actx, output) {
    this.actx = actx;
    this.output = output;

    // Create the piano string osc
    this.osc = this.actx.createOscillator();
    this.osc.type = 'sine';
    this.osc.frequency.value = 0;

    // Create the piano string gain node
    this.gainNode = this.actx.createGain();
    this.gainNode.gain.value = 0;

    // Connect the osc to the gain node, and the gain node to the output
    this.osc.connect(this.gainNode);
    this.gainNode.connect(this.output);

    // Start the osc
    this.osc.start();
  }

  playNote(note) {
    const frequency = 440 * Math.pow(2, (note - 69) / 12);
    this.osc.frequency.setValueAtTime(frequency, this.actx.currentTime);
    this.gainNode.gain.setValueAtTime(1, this.actx.currentTime);
  }

  releaseNote() {
    this.gainNode.gain.setValueAtTime(0, this.actx.currentTime);
  }
}

// where it completely resorted to an osc based piano-type
// instrument
// when pressed, it got quite concerned with the computing power
// required to modal an actual grand piano and tries to divert us
// to using a sample based approach!
*/

/*
You are correct, the current implementation is not connected to the `actx` destination. This means that the sound generated by our piano will not be audible.

To fix this issue, we need to connect the output of our piano sound generator to the `actx` destination. We can do this by adding the following line of code at the end of the `init` function:

```
this.output.connect(this.actx.destination);
```

This will connect the output of our piano sound generator to the `actx` destination, which will make the sound audible.

Here's the updated `init` function with the output connection:

```
function init() {
  this.actx = new (window.actx || window.webkitAudioContext)();
  this.output = this.actx.createGain();
  this.output.gain.value = 0.5;

  // Create the piano sound generator
  this.piano = new Piano(this.actx, this.output);

  // Connect the piano output to the audio context destination
  this.output.connect(this.actx.destination);
}
```

I hope this helps! Let me know if you have any further questions or issues.
*/

// window.onload = function () {
//   init();
// };

// function init() {
//   this.actx = new (window.actx || window.webkitAudioContext)();
//   this.output = this.actx.createGain();
//   this.output.gain.value = 0.5;

//   // Create the piano sound generator
//   // don't need this crap:-
//   //   this.piano = new Piano(this.actx, this.output);

//   // Connect the piano output to the audio context destination
//   this.output.connect(this.actx.destination);
// }

/* ****** TestAbstract Things from chatGPT ****** */
/*
document.addEventListener("mousedown", play, false);

function play(e) {
  const context = new actx();
  const osc = context.createOscillator();
  const waveShaper = context.createWaveShaper();

  // Set the waveshaper curve to create a distortion effect
  const curve = new Float32Array([0, 0.2, 0.4, 0.6, 0.8, 1]);
  waveShaper.curve = curve;

  // Connect the osc to the waveshaper node
  osc.connect(waveShaper);

  // Connect the waveshaper node to the audio output
  waveShaper.connect(context.destination);
  // Start the osc and hear the distorted sound
  osc.start();
  osc.stop(actx.currentTime + 1);
}
*/

/* ****** Stu's Code ****** */
// calculate all piano frequencies from A0 to C8
// Note: keyboard A0 (the first key) = 27.5Hz
console.log(27.5 * Math.pow(2, 0 / 12)); // 27.5
// const arr = [];
// for (let i = 0; i < 88; i++) {
//   arr.push(27.5 * Math.pow(2, i / 12));
//   console.log("arr[i]", arr[i]);
//   console.log(27.5 * Math.pow(2, i / 12));
// }
