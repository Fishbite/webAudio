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
record additionanl tunes, beats etc. on top of it.

Currently, the user has to upload their
recording to the server, which is far from ideal.

*/
const actx = new AudioContext();

function setAudioSource(event) {
  console.log("event:", event, "this:", this);

  // get the file from the input event
  // this referes to the input element from the document
  const file = this.files[0];
  // create a property on the window object
  const URL = window.URL;

  console.log("file", file);

  // var to hold an object URL for our selected file
  let fileURL;

  // CHECK: file has a value
  if (file) {
    // assign a new object URL to our variable
    fileURL = URL.createObjectURL(file);
  }

  console.log("fileURL", fileURL);

  // get the audio element from the document
  const audioNode = document.getElementById("audio");
  // set the audio source to our object URL
  audioNode.src = fileURL;

  // ****** Pre-recorded Music Start ****** \\
  // A variable to store our arrayBuffer
  let soundBuffer;

  // A stereo panner node
  let panNode = actx.createStereoPanner();

  // CHECK: fileURL has a value then create an XHR request
  if (fileURL) {
    // Load the sound \\
    let xhr = new XMLHttpRequest();
    // set xhr.open url value to fileURL
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

  /* ****** REVOKE object URL ****** */
  // apparently best practice to revoke the object URL
  // when safe to do so, because a new one will be
  // created even if one already exists
  fileURL = URL.revokeObjectURL(file);
  console.log("object URL revoked. fileURL is now:", fileURL);
}

const inputNode = document.getElementById("input");
inputNode.addEventListener("change", setAudioSource, false);
