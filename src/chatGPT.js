console.log("chatter, chatter, chatter... :-)");
/* The following code creates an audio graph that synthesizes a basic piano sound using a physical modeling technique known as modal synthesis: 

    This implementation creates a bank of bandpass filters that simulate the resonances of a piano string. The filters are excited using gain nodes that simulate the hammer hitting the string. When a note is triggered, the gain and excitation nodes for the corresponding filter are ramped up and then down over a period of 1 second to simulate the decay of the sound.
*/

// create audio context
const audioContext = new AudioContext();

// create nodes
const input = audioContext.createGain();
const output = audioContext.createGain();
const speakers = audioContext.destination;
const modalFilters = [];
const modalGain = [];
const modalExciters = [];

// create modal filter bank
for (let i = 0; i < 88; i++) {
  const f0 = 27.5 * Math.pow(2, (i - 21) / 12);
  const modalFilter = audioContext.createBiquadFilter();
  modalFilter.type = "bandpass";
  modalFilter.frequency.value = f0;
  modalFilters.push(modalFilter);
}

// create modal gain nodes
for (let i = 0; i < 88; i++) {
  const modalGainNode = audioContext.createGain();
  modalGainNode.gain.value = 0.0;
  modalGain.push(modalGainNode);
}

// create modal exciter nodes
for (let i = 0; i < 88; i++) {
  const modalExciter = audioContext.createGain();
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
const q = 20;
for (let i = 0; i < 88; i++) {
  const f0 = 27.5 * Math.pow(2, (i - 21) / 12);
  modalFilters[i].Q.value = q;
  modalExciters[i].gain.value = 1.0;
}

// trigger piano note
// See updated version that actually makes a sound! Hopefully!!!
// function triggerNote(note) {
//   const i = note - 21;
//   const vel = 1.0;
//   modalGain[i].gain.cancelScheduledValues(0);
//   modalGain[i].gain.setValueAtTime(0.0, audioContext.currentTime);
//   modalGain[i].gain.linearRampToValueAtTime(
//     vel,
//     audioContext.currentTime + 0.05
//   );
//   modalGain[i].gain.linearRampToValueAtTime(
//     0.0,
//     audioContext.currentTime + 1.0
//   );
//   modalExciters[i].gain.cancelScheduledValues(0);
//   modalExciters[i].gain.setValueAtTime(0.0, audioContext.currentTime);
//   modalExciters[i].gain.linearRampToValueAtTime(
//     vel,
//     audioContext.currentTime + 0.001
//   );
//   modalExciters[i].gain.linearRampToValueAtTime(
//     0.0,
//     audioContext.currentTime + 1.0
//   );
// }

// Updated function:
function triggerNote(note) {
  const i = note - 21;
  const vel = 1.0;
  modalGain[i].gain.cancelScheduledValues(0);
  modalGain[i].gain.setValueAtTime(0.0, audioContext.currentTime);
  modalGain[i].gain.linearRampToValueAtTime(
    vel,
    audioContext.currentTime + 0.05
  );
  modalGain[i].gain.linearRampToValueAtTime(
    0.0,
    audioContext.currentTime + 1.0
  );
  modalExciters[i].gain.cancelScheduledValues(0);
  modalExciters[i].gain.setValueAtTime(0.0, audioContext.currentTime);
  modalExciters[i].gain.linearRampToValueAtTime(
    vel,
    audioContext.currentTime + 0.001
  );
  modalExciters[i].gain.linearRampToValueAtTime(
    0.0,
    audioContext.currentTime + 1.0
  );

  const frequency = 27.5 * Math.pow(2, (note - 49) / 12);
  const oscillator = audioContext.createOscillator();
  oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
  oscillator.type = "triangle";
  oscillator.start();
  oscillator.stop(audioContext.currentTime + 1.0);

  oscillator.connect(modalFilters[i]);
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
// `audioContext` destination

// Response from chatGPT:

// notice the introduction of `Piano` which is an undefind class.
// It appears that whne we leave chatGPT alone for a while, day or so,
// it seems to forget where it was. i.e. we were tring to create
// sounds using modal synthesis and that was left completely out of
// the loop when it created the `Piano` class:
/*
class Piano {
  constructor(audioContext, output) {
    this.audioContext = audioContext;
    this.output = output;

    // Create the piano string oscillator
    this.oscillator = this.audioContext.createOscillator();
    this.oscillator.type = 'sine';
    this.oscillator.frequency.value = 0;

    // Create the piano string gain node
    this.gainNode = this.audioContext.createGain();
    this.gainNode.gain.value = 0;

    // Connect the oscillator to the gain node, and the gain node to the output
    this.oscillator.connect(this.gainNode);
    this.gainNode.connect(this.output);

    // Start the oscillator
    this.oscillator.start();
  }

  playNote(note) {
    const frequency = 440 * Math.pow(2, (note - 69) / 12);
    this.oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);
    this.gainNode.gain.setValueAtTime(1, this.audioContext.currentTime);
  }

  releaseNote() {
    this.gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
  }
}

// where it completely resorted to an oscillator based piano-type
// instrument
// when pressed, it got quite concerned with the computing power
// required to modal an actual grand piano and tries to divert us
// to using a sample based approach!
*/

/*
You are correct, the current implementation is not connected to the `audioContext` destination. This means that the sound generated by our piano will not be audible.

To fix this issue, we need to connect the output of our piano sound generator to the `audioContext` destination. We can do this by adding the following line of code at the end of the `init` function:

```
this.output.connect(this.audioContext.destination);
```

This will connect the output of our piano sound generator to the `audioContext` destination, which will make the sound audible.

Here's the updated `init` function with the output connection:

```
function init() {
  this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
  this.output = this.audioContext.createGain();
  this.output.gain.value = 0.5;

  // Create the piano sound generator
  this.piano = new Piano(this.audioContext, this.output);

  // Connect the piano output to the audio context destination
  this.output.connect(this.audioContext.destination);
}
```

I hope this helps! Let me know if you have any further questions or issues.
*/

// window.onload = function () {
//   init();
// };

// function init() {
//   this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
//   this.output = this.audioContext.createGain();
//   this.output.gain.value = 0.5;

//   // Create the piano sound generator
//   // don't need this crap:-
//   //   this.piano = new Piano(this.audioContext, this.output);

//   // Connect the piano output to the audio context destination
//   this.output.connect(this.audioContext.destination);
// }
