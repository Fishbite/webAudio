console.log("Connected to the moon!");

// create the context
const actx = new AudioContext();

function playNoteUgh(freq = 261.63, type = "sine", decay = 1) {
  // create oscillator and gain nodes
  let osc = actx.createOscillator();
  let vol = actx.createGain();

  // set the supplied values
  osc.frequency.value = freq;
  osc.type = type;

  vol.gain.value = 0.1;

  //create the audio graph
  osc.connect(vol).connect(actx.destination);

  osc.start(actx.currentTime);
  osc.stop(actx.currentTime + decay);
}

function playNote(freq = 261.63, type = "sine", decay = 1) {
  // Create a new oscillator and audio graph for each keypress
  createOsc(freq, type, decay);
}

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

  //create the audio graph
  osc.connect(vol).connect(compressor).connect(actx.destination);

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

window.addEventListener("keydown", keyDownHandler, { passive: false });

// Some musical note values:
let C4 = 261.63,
  D4 = 293.66,
  E4 = 329.63,
  F4 = 349.23,
  G4 = 392,
  A5 = 440,
  B5 = 493.88,
  C5 = 523.25,
  D5 = 587.33,
  E5 = 659.25;

function keyDownHandler(event) {
  let key = event.key;

  if (key === "1") playNote(C4);
  if (key === "2") playNote(D4);
  if (key === "3") playNote(E4);
  if (key === "4") playNote(F4);
  if (key === "5") playNote(G4);
  if (key === "6") playNote(A5);
  if (key === "7") playNote(B5);
  if (key === "8") playNote(C5);
  if (key === "9") playNote(D5);
  if (key === "0") playNote(E5);

  if (key === "q") playNoteUgh(C4);
  if (key === "w") playNoteUgh(D4);
  if (key === "e") playNoteUgh(E4);
  if (key === "r") playNoteUgh(F4);
  if (key === "t") playNoteUgh(G4);
  if (key === "y") playNoteUgh(A5);
  if (key === "u") playNoteUgh(B5);
  if (key === "i") playNoteUgh(C5);
  if (key === "o") playNoteUgh(D5);
  if (key === "p") playNoteUgh(E5);
}

// For stackoverflow:
// Create a variable to reference your music file
// const music = new Audio("./audio/music.wav");

// Add an event listener to detect user interaction
// and add a callback function that will run when
// the event occurs
// window.addEventListener("click", playMusic);

// Function to play the music
// function playMusic() {
//   // start the music
//   music.play();
//   // make the music loop continuously
//   music.loop = true;
// }
