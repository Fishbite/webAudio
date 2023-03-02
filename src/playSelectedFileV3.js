console.log("playSelectedV2.js connected");

/* ****** Intent of this file ****** \\
    to create a useable program based
    on the research covered in 
    playSelectedFile.js
    i.e. give the user the ability to
    select an audio file from their
    local HDD so that they can record
    additional rythms, tunes, drums etc.
    on top of that.
*/

// audio context iitialized by script.js
// actx = new AudioContext();

// global variables for our sound file
let fileURL;
let soundBuffer;

// create a URL of the file object
function makeURL(event) {
  const file = this.files[0];
  //   const URL = window.URL;

  if (file) {
    console.log(file);

    // this works, so we can lose the var URL
    fileURL = window.URL.createObjectURL(file);
    console.log(fileURL);
  } else {
    // no file selected
    console.log("No file selected");
  }

  return prepSound(fileURL);
}

// prep and decode the audio file
// basically, decode the audio file
// and stick it in a buffer for later
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
        console.log("xhr.response", xhr.response);
      },

      (error) => {
        throw new Error(`We have an error. No decodie! ${error}`);
      }
    );
  }
}

class playSoundBuffer {
  constructor(actx, soundBuffer) {
    this.actx = actx;
    this.soundBuffer = soundBuffer;
    this.soundNode = null;
    this.volumeNode = null;
    this.startTime = 0;

    if (!soundBuffer) {
      console.log("No sound buffer found");
    } else {
      this.soundNode = this.actx.createBufferSource();
      this.soundNode.buffer = soundBuffer;
      this.soundNode.loop = true;

      // need to check for the global audio context and a
      // audio graph that records live audio

      this.volumeNode = actx.createGain();
      this.volumeNode.gain.value = 0.5;

      if (typeof mainVol === "undefined" || typeof mainVol === null) {
        console.log("We DO NOT have a recording chain");
        this.soundNode.connect(this.volumeNode).connect(actx.destination);
        this.soundNode.start(actx.currentTime);
      } else {
        console.log("We have a recording chain");
        this.soundNode.connect(this.volumeNode).connect(mainVol);
        this.soundNode.start(actx.currentTime);
      }
    }
  }
  stop() {
    if (this.soundNode) this.soundNode.stop(actx.currentTime);
  }
}

// implement a class wrapper so that we don't
// have to modify our program code if we change
// the playSudio class
function playSelected(actx, soundBuffer) {
  return new playSoundBuffer(actx, soundBuffer);
}

// get the input element from the doc
fileSelector = document.getElementById("file");
fileSelector.addEventListener("input", makeURL, false);

window.addEventListener("keydown", function (e) {
  console.log("soundBuffer", soundBuffer);
  switch (e.key) {
    // Play music normally
    case "a":
      let run = new playSoundBuffer(actx, soundBuffer);

      window.addEventListener("keydown", keyDownHandler, false);
      function keyDownHandler(e) {
        if (e.key === "d") run.stop();
      }
  }
});
