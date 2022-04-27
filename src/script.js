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
  }
}

function stopRecording() {
  recorder.ondataavailable = function (e) {
    // Set the audioTag html element source to the Blob
    audioTag.src = URL.createObjectURL(e.data);
    console.log(e.data, recorder.src);
  };

  recorder.stop();
}

// attach event listener to the stop button
stopBtn.addEventListener("click", (e) => {
  console.log("stopBtn clicked");

  stopRecording();
  console.log(recorder.state);
});

// ************* Live Output Recording Setup END ************ \\

// ************* Musical Note Generators START ************ \\

// This function plays raw oscillator sounds
// Stopping them abruptly causes an audible ugly "click"
// We're not recording this tripe!
function playNoteUgh(freq = 261.63, type = "sine", decay = 1) {
  // create oscillator and gain nodes
  let osc = actx.createOscillator();
  let vol = actx.createGain();

  // set the supplied values
  osc.frequency.value = freq;
  osc.type = type;

  vol.gain.value = 1;

  //create the audio graph
  osc.connect(vol).connect(actx.destination);

  osc.start(actx.currentTime);
  osc.stop(actx.currentTime + decay);
}

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
// ************* Variables to Hold Musical Notes END ************ \\

// ************* Keyboard Controls START ************ \\
window.addEventListener("keydown", keyDownHandler, false);

function keyDownHandler(event) {
  let key = event.key;
  // Start recording if a key is pressed and the
  // recorder's state is not "recording"
  console.log(recorder.state);
  if (recorder.state !== "recording") {
    startRecording();
    console.log(recorder.state);
  }

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

  // We are not recording these sounds
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
// ************* Keyboard Controls END ************ \\
