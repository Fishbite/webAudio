console.log("Recorder connected.....YippeeAyYaaay!");

/* ****** Code Provided By MDN web docs 

https://developer.mozilla.org/en-US/docs/Web/API/AudioContext/createMediaStreamDestination

*/

const b = document.querySelector("button");
let clicked = false;
let chunks = [];
let ac;
let osc;
let dest;
let mediaRecorder;

function init() {
  ac = new AudioContext();
  osc = ac.createOscillator();
  dest = ac.createMediaStreamDestination();
  mediaRecorder = new MediaRecorder(dest.stream);
  osc.connect(dest);
  // added this so we can hear the sine wave playing live
  osc.connect(ac.destination);

  mediaRecorder.ondataavailable = function (evt) {
    // push each chunk (blobs) in an array
    chunks.push(evt.data);
  };

  mediaRecorder.onstop = function (evt) {
    // Make blob out of our blobs, and open it.
    let blob = new Blob(chunks, { type: "audio/ogg; codecs=opus" });
    let audioTag = document.createElement("audio");
    document.querySelector("audio").src = URL.createObjectURL(blob);
  };
}

b.addEventListener("click", function (e) {
  if (!ac) {
    init();
  }

  if (!clicked) {
    mediaRecorder.start();
    osc.start(0);
    e.target.innerHTML = "Stop recording";
    clicked = true;
  } else {
    mediaRecorder.requestData();
    mediaRecorder.stop();
    osc.stop(0);
    e.target.disabled = true;
  }
});
