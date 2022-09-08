// (function localFileVideoPlayer() {
//   "use strict";
//   var setAudioSource = function (event) {
//     var file = this.files[0];
//     var URL = window.URL || window.webkitURL;
//     var fileURL = URL.createObjectURL(file);
//     var videoNode = document.querySelector("audio");
//     videoNode.src = fileURL;
//   };
//   var inputNode = document.querySelector("input");
//   inputNode.addEventListener("change", setAudioSource, false);
// })();

/* 
************ File info & Intent ************ 

This file is work in progress. The intention is to
provide the user with the facility to select an
audio file from their local hard drive in order to
play it whilst they are recording additionanl tunes,
beats etc. Currently, the user has to upload their
recording to the server, which is far from ideal.

*/
const actx = new AudioContext();

function setAudioSource(event) {
  console.log("event:", event, "this:", this);

  const file = this.files[0];
  const URL = window.URL;
  const fileURL = URL.createObjectURL(file);

  console.log("fileURL", fileURL);

  const audioNode = document.getElementById("audio");
  audioNode.src = fileURL;

  // ****** Pre-recorded Music Start ****** \\
  // A variable to store our arrayBuffer
  let soundBuffer;

  // A stereo panner node
  let panNode = actx.createStereoPanner();

  // Load the sound \\
  let xhr = new XMLHttpRequest();
  xhr.open("GET", fileURL, true); // true: load asynchronously, create event

  // load as a binary file with responsType `arraybuffer`
  xhr.responseType = "arraybuffer";

  // load the sound
  xhr.send();

  xhr.addEventListener("load", onLoad, false);

  function onLoad(event) {
    actx.decodeAudioData(
      xhr.response,
      (buffer) => {
        soundBuffer = buffer;
      },

      (error) => {
        throw new Error(`It no possibla decodie audioie ${error}`);
      }
    );
  }

  // Set the initial `pan` value
  let pan = "left";

  // A panLoop that pans the sound from ear to ear
  function panLoop() {
    requestAnimationFrame(panLoop);

    if (pan === "left" && panNode.pan.value < 1) {
      panNode.pan.value += 0.0125;
      // stop panning from the left to right
      if (panNode.pan.value >= 1) pan = "right";
    }

    if (pan === "right" && panNode.pan.value >= -1) {
      panNode.pan.value -= 0.0125;
      // stop panning from the right to left
      if (panNode.pan.value <= -1) pan = "left";
    }
  }
  // ****** Pre-recorded Music End ****** \\
}

const inputNode = document.getElementById("input");
inputNode.addEventListener("change", setAudioSource, false);
