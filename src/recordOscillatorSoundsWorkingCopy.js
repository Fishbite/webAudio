console.log("YeeeHaaa!");

/*
    This file is the first successful attempt to
    record oscillators with the MediaRecorder.

    There are only two keyboard keys set up #1 & #2
    and the sounds they play are pretty dull and raw,
    thus, we can hear and record those ugly clicks as
    each oscillator is stopped. However:

      ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      THESE ARE THE FOUNDATIONS OF SOMETHING GREAT!
      ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
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

// ****** Audio Graph Set Up Start ****** \\
// Define the global context, recording stream & gain nodes
actx = new AudioContext();

streamDest = actx.createMediaStreamDestination();

mainVol = actx.createGain();
mainVol.gain.value = 0.1;

// Create a new MediaRecorder and feed it to our stream
recorder = new MediaRecorder(streamDest.stream);

// Connect the main gain node to the recording stream and speakers
mainVol.connect(streamDest);
mainVol.connect(actx.destination);

// ****** Audio Graph Set Up End ****** \\

// ****** Start & Stop Recoding Functions ****** \\
// Function to run when we want to start recording
function startRecording() {
  recorder.start();
  started = true;
}

// Function to run when we want to terminate the recording
function stopRecording() {
  recorder.ondataavailable = function (e) {
    audioTag.src = URL.createObjectURL(e.data);

    stopped = true;
  };
  recorder.stop();
}
// ****** Start & Stop Recoding Functions End ****** \\

// ****** Starting the recorder before we play a note
// ****** didn't work so this was removed
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

// ****** Our Stop Button Event Listener ****** \\
stopBtn.addEventListener("click", (e) => {
  console.log("stop button clicked");

  stopRecording();
});

// ****** A function to play a note ****** \\
function playNote(freq, decay = 1, type = "sine") {
  let osc = actx.createOscillator();
  osc.frequency.value = freq;

  osc.connect(mainVol); // connect to stream destination via main gain node

  // Only start the media recorder if it is not already recording
  if (recorder.state !== "recording") {
    startRecording();
  }
  console.log(mainVol);
  osc.start(actx.currentTime);
  osc.stop(actx.currentTime + decay);
}

// keydown event listener attached to the window
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
