console.log("Connected to the moon!");

/* // ****** LICENSE NOTICE ****** \\
      COPYRIGHT: 2020 Stuart Peel 
      This PROGRAM is distributed under the terms of the:
      AGPL-3.0-or-later

      What does this  mean? Well, basically it free!
      Do what you want with it:

        Use it
        Modify it
        Give it away as a freebee!
        Sell it
        Distribute it
      
      If you modify it, please make it available to everyone, 
      it's part of the license T's & C's

      // ****** LICENSE NOTICE ****** \\
*/

/*
  This is the main file that sets up the recording facility to enable
  live recording of oscillators and pre-recorded music i.e. The user
  can record music as they play it, play that music back and play
  additional musical composition on top of that, such as the addition
  of drums, percusion, other voices etc.

  The user can save the recording by right clicking the audio recorder and save it to their local HDD.
  
  ****** This File Must Be Loaded First So That Other ******
  ******    Files Can Connect Other Audio Graphs To   ******
  ****** The Global Audio Context & The Recording Chain ******

*/

// ****** DO NOT CHANGE CODE BELOW THIS LINE ****** \\
// create the context
const actx = new AudioContext();
console.log(actx.state);

// ************* Live Output Recording Setup START ************ \\
// Create the things we need to reocord live output from
// our music generators
// Connect your audio graphs to this `mainVol` node
let mainVol = actx.createGain(),
  // create a media stream destination node
  streamDest = actx.createMediaStreamDestination(),
  // create a recorder and connect it to the stream
  recorder = new MediaRecorder(streamDest.stream),
  // Get our audio element from the document
  audioTag = document.getElementById("audioTag"),
  // Get our stop button
  stopBtn = document.getElementById("stopBtn"),
  recordingStopped = false;

// let's set the global volume
mainVol.gain.value = 1;

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
    console.log("media recorder is: ", recorder.state);
  }
});

// ************* Live Output Recording Setup END ************ \\
// ****** DO NOT CHANGE CODE ABOVE THIS LINE ****** \\
