console.log("chattering :->>>");

const audioContext = new AudioContext();
/*
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
  output.connect(audioContext.destination);
}

// set parameters
const q = 20;
for (let i = 0; i < 88; i++) {
  const f0 = 27.5 * Math.pow(2, (i - 21) / 12);
  modalFilters[i].Q.value = q;
  modalExciters[i].gain.value = 1.0;
}

// trigger piano note
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
}

*/

// chatter 2!
// create audio context
/*
const audioContext = new AudioContext();

// create nodes
const input = audioContext.createGain();
const output = audioContext.createGain();
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
  output.connect(audioContext.destination);
}

// set parameters
const q = 20;
for (let i = 0; i < 88; i++) {
  const f0 = 27.5 * Math.pow(2, (i - 21) / 12);
  modalFilters[i].Q.value = q;
  modalExciters[i].gain.value = 1.0;
}

// trigger piano note
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
    0.0,
    audioContext.currentTime + 1.0
  );
}

document.addEventListener("keydown", playNote, false);

function playNote(e) {
  console.log(e.keyCode);
  const note = e.keyCode;
  triggerNote(note);
}
*/

// chatter 3 !!!
// create nodes
const input = audioContext.createGain();
const output = audioContext.createGain();
const modalFilters = [];
const modalGain = [];
const modalExciters = [];
const oscillator = audioContext.createOscillator(); // Add this line

// set oscillator parameters
oscillator.type = "triangle";
oscillator.frequency.value = 0;
oscillator.start(0);

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
  output.connect(audioContext.destination);
}

// set parameters
const q = 20;
for (let i = 0; i < 88; i++) {
  const f0 = 27.5 * Math.pow(2, (i - 21) / 12);
  modalFilters[i].Q.value = q;
  modalExciters[i].gain.value = 1.0;
}

// trigger piano note
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
    audioContext.currentTime + 0.05
  );
  modalExciters[i].gain.linearRampToValueAtTime(
    0.0,
    audioContext.currentTime + 1.0
  );

  oscillator.frequency.cancelScheduledValues(0); // Add this line
  oscillator.frequency.setValueAtTime(f0, audioContext.currentTime); // Add this line
}

document.addEventListener("keydown", playNote, false);

function playNote(e) {
  console.log(e.keyCode);
  const note = e.keyCode;
  triggerNote(note);
}
