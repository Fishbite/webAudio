console.log("playSelectedV2.js connected");

/* ****** Intent of this file ****** \\
    to create a useable program based
    on the research covered in 
    playSelectedFile.js
*/

// create the audio context
actx = new AudioContext();

// global variables for our sound file
let fileURL;
let soundBuffer;

// create a URL of the file object
function makeURL(event) {
  const file = this.files[0];
  const URL = window.URL;

  if (file) {
    console.log(file);
    fileURL = URL.createObjectURL(file);
    console.log(fileURL);
  } else {
    // no file selected
    console.log("No file selected");
  }

  prepSound(fileURL);
}

// prep and decode the audio file
function prepSound(fileURL) {
  console.log("prepping!", fileURL);

  let xhr = new XMLHttpRequest();
  xhr.open("GET", fileURL, true);
  xhr.responseType = "arraybuffer";
  xhr.send();
  xhr.addEventListener("load", onload, false);

  function onload(event) {
    actx.decodeAudioData(
      xhr.response,
      (buffer) => {
        soundBuffer = buffer;
        console.log("soundBuffer", soundBuffer);
      },

      (error) => {
        throw new Error(`We have an error. No decodie! ${error}`);
      }
    );
  }
}

class playAudio {
  constructor(actx, soundBuffer) {
    this.actx = actx;
    this.soundBuffer = soundBuffer;
    this.soundNode = null;
    this.startTime = 0;

    if (!soundBuffer) {
      console.log("No sound buffer found");
    } else {
      this.soundNode = this.actx.createBufferSource();
      this.soundNode.buffer = soundBuffer;
      this.soundNode.loop = true;

      const volumeNode = actx.createGain();
      volumeNode.gain.value = 0.5;

      this.soundNode.connect(volumeNode).connect(actx.destination);
      this.soundNode.start(actx.currentTime);
    }
  }
  stop() {
    this.soundNode.stop(actx.currentTime);
  }
}

// get the input element from the doc
fileSelector = document.getElementById("file");
fileSelector.addEventListener("input", makeURL, false);

window.addEventListener("keydown", function (e) {
  console.log("soundBuffer", soundBuffer);
  switch (e.key) {
    // Play music normally
    case "a":
      //   if (soundBuffer) {
      //     let soundNode = actx.createBufferSource();
      //     soundNode.buffer = soundBuffer;
      //     soundNode.loop = true;

      //     let volumeNode = actx.createGain();
      //     volumeNode.gain.value = 0.5;

      //     soundNode.connect(volumeNode).connect(actx.destination);
      //     soundNode.start(actx.currentTime);
      let run = new playAudio(actx, soundBuffer);

      window.addEventListener("keydown", keyDownHandler, false);
      function keyDownHandler(e) {
        if (e.key === "d") run.stop();
      }
  }
});
