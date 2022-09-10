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
i.e. they can record a melody, play that back, add
some rythm in another octave whilst recording and,
then add some drum beats. Theoretically, they could
put together a whole orchestral composition.

Of course, we would need a range of instruments to
accomplish the above..... But that's the easy part :-P

Currently, the user has to upload their
recording to the server, which is far from ideal.
*/

// move this function to playSelectedFileV2.js
const FILEURL = function (event) {
  const file = this.files[0];
  const URL = window.URL;
  let fileURL;

  if (file) {
    fileURL = URL.createObjectURL(file);
  }

  return fileURL;
};

const actx = new AudioContext();

function setAudioSource(event) {
  console.log("event:", event, "this:", this);

  // get the file from the input event fired when the
  // user selects a file with the file selector
  // 'this' referes to the input element from the document
  const file = this.files[0];
  // create a property on the window object
  const URL = window.URL;
  console.log(URL);

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

  // ****** START: Pre-recorded Music Buffer ****** \\

  // A variable to store our arrayBuffer
  let soundBuffer;

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
  // ****** END: Pre-recorded Music Buffer****** \\

  // ****** START: play the buffered music file ****** \\

  window.addEventListener("keydown", function (e) {
    switch (e.key) {
      // Play music normally (without panning)
      case "a":
        if (soundBuffer) {
          let soundNode = actx.createBufferSource();
          soundNode.buffer = soundBuffer;
          soundNode.loop = true;

          let volumeNode = actx.createGain();
          volumeNode.gain.value = 0.5;

          console.log("making connections");
          soundNode.connect(volumeNode).connect(actx.destination);
          console.log("starting soundNode");
          soundNode.start(actx.currentTime);
          console.log("soundNode started");

          window.addEventListener("keydown", keyDownHandler, false);
          function keyDownHandler(e) {
            if (e.key === "d") soundNode.stop();
          }
        }
        break;
    }
  });

  /* ****** REVOKE object URL ****** */
  // apparently best practice to revoke the object URL
  // when safe to do so, because a new one will be
  // created even if one already exists
  fileURL = URL.revokeObjectURL(file);
  console.log("object URL revoked. fileURL is now:", fileURL, false);
}

const inputNode = document.getElementById("input");
inputNode.addEventListener("change", setAudioSource, false);
