console.log("YeeeHaaa!");

/*
    This file does two things, it creates an
    audio recorder that reccords a black (empty)
    audio stream - pretty useless as is.

    It also plays a note plays via an oscillator
    when key #1 is pressed.

    If the 'start recording' button has been clicked
    pressing key #1 does nothing, however, if
    'start recording; hasn't been pressed pressing
    key #1 will start recoding and play the note.
    Unfortunately, the recording restarts everytime
    key #1 is pressed, so this will not do for
    recording multiple succesive notes.

    We'll try another way to achieve this in test3
*/

// Variables
let audioTag = document.getElementById("audioTag"),
  started = false,
  stopped,
  //   startBtn = document.getElementById("startBtn"),
  stopBtn = document.getElementById("stopBtn"),
  actx,
  recorder = false,
  streamDest = false,
  mainVol;

// Define the global context, recording stream & gain nodes
actx = new AudioContext();

streamDest = actx.createMediaStreamDestination();

mainVol = actx.createGain();
mainVol.gain.value = 0.1;

// Create a new MediaRecorder and attached it to our stream
recorder = new MediaRecorder(streamDest.stream);

// Connect the main gain node to the recording stream and speakers
mainVol.connect(streamDest);
mainVol.connect(actx.destination);

// Function to run when we want to start recording
function startRecording() {
  recorder.start();
  started = true;

  console.log(recorder.state);
}

// Function to run when we want to terminate the recording
function stopRecording() {
  recorder.ondataavailable = function (e) {
    audioTag.src = URL.createObjectURL(e.data);

    // recorder = false;
    stopped = true;
  };
  recorder.stop();
}

// Event listeners attached to the start and stop buttons
// startBtn.addEventListener(
//   "click",
//   (e) => {
//     e.target.disabled = true;
//     console.log("start button clicked");
//     startRecording();
//   },
//   false
// );

stopBtn.addEventListener("click", (e) => {
  console.log("stop button clicked");
  //   startBtn.disabled = false;
  stopRecording();
});

// A function to play a note
function playNote(freq, decay = 1, type = "sine") {
  let osc = actx.createOscillator();
  osc.frequency.value = freq;

  osc.connect(mainVol); // connect to stream destination via main gain node

  // Only start the media recorder if it is not already recording
  if (recorder.state !== "recording") {
    startRecording();
  } // If this isn't here, the note doesn't play
  console.log(mainVol);
  osc.start(actx.currentTime);
  osc.stop(actx.currentTime + decay);
}

// keydown evennt listener attached to the window
window.addEventListener("keydown", keyDownHandler, false);

// The keydown handler
function keyDownHandler(e) {
  if (e.key === "1") {
    console.log(e.key, "pressed");
    playNote(440);
  }

  if (e.key === "2") {
    playNote(600);
  }
}
