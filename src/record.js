console.log("Recorder connected.....YippeeAyYaaay!");

/* ****** Code Provided By MDN web docs 

https://developer.mozilla.org/en-US/docs/Web/API/AudioContext/createMediaStreamDestination

*/

const btn = document.querySelector("button");
let clicked = false;
let chunks = [];
let ac;
let osc;
let dest;
let mediaRecorder;

function init() {
  ac = new AudioContext();
  dest = ac.createMediaStreamDestination();
  mediaRecorder = new MediaRecorder(dest.stream);

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

btn.addEventListener("click", function (e) {
  if (!ac) {
    init();
    console.log(ac, dest, mediaRecorder);
  }

  if (!clicked) {
    mediaRecorder.start();
    // osc.start(0);
    playNote();
    e.target.innerHTML = "Stop recording";
    clicked = true;
  } else {
    mediaRecorder.requestData();
    mediaRecorder.stop();
    osc.stop(0);
    e.target.disabled = true;
  }
});

let actx = new AudioContext();
dest = actx.createMediaStreamDestination();
mediaRecorder = new MediaRecorder(dest.stream);

function playNote(freq, decay = 1, type = "sine") {
  let osc = actx.createOscillator();
  osc.connect(dest);
  osc.connect(actx.destination);
  osc.start();
  mediaRecorder.start();
  console.log(mediaRecorder.state);

  function stop() {
    osc.stop();
  }
}

window.addEventListener("keydown", keyDownHandler, false);

function keyDownHandler(e) {
  if (e.key === "1") {
    playNote();

    mediaRecorder.requestData();
  }

  if (e.key === "2") {
    playNote().stop();
  }
}
