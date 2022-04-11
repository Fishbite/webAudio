console.log("Recorder connected.....YippeeAyYaaay!");

const actx = new AudioContext();
const stream = actx.createMediaStreamDestination();

const mainVol = actx.createGain();

/* ****** Code Below Provided By MDN web docs ****** 

https://developer.mozilla.org/en-US/docs/Web/API/AudioContext/createMediaStreamDestination

*/

const btn = document.querySelector("button");
let clicked = false,
  chunks = [],
  ac,
  osc,
  dest,
  vol,
  mediaRecorder;

function init() {
  ac = new AudioContext();
  osc = ac.createOscillator();
  osc.frequency.value = 150;
  dest = ac.createMediaStreamDestination();
  mediaRecorder = new MediaRecorder(dest.stream);
  osc.connect(dest);
  // added this so we can hear the sine wave playing live
  osc.connect(ac.destination);

  mediaRecorder.ondataavailable = function (evt) {
    // push each chunk (blobs) in an array
    // console.log(evt.data);
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
  }

  if (!clicked) {
    mediaRecorder.start();

    osc.start(0);
    e.target.innerHTML = "Stop recording";
    clicked = true;
  } else {
    mediaRecorder.requestData();
    console.log(mediaRecorder);
    mediaRecorder.stop();
    osc.stop(ac.currentTime);
    e.target.disabled = true;
  }
});

/* ****** Code Above Provided By MDN web docs ****** */

//* ****** Lets see if we can implement this in our kick drum ****** *\\

class Kick {
  constructor(actx) {
    this.actx = actx;
  }
  setup() {
    this.osc = this.actx.createOscillator();
    this.dest = this.actx.createMediaStreamDestination();
    // console.log("dest", this.dest);
    this.vol = this.actx.createGain();
    this.osc.connect(this.vol);
    this.vol.connect(this.dest);
    this.vol.connect(this.actx.destination);
    this.mediaRecorder = new MediaRecorder(this.dest.stream);

    this.mediaRecorder.ondataavailable = function (event) {
      //   console.log(event.data);
      chunks.push(event.data);

      //   console.log(chunks);
    };

    this.mediaRecorder.onstop = function (evt) {
      // Make blob out of our blobs, and open it.

      let blob = new Blob(chunks, { type: "audio/ogg; codecs=opus" });

      //   console.log(blob);

      let audioTag = document.createElement("audio");
      document.querySelector("audio").src = URL.createObjectURL(blob);
    };
  }
  play(time) {
    this.setup();
    this.mediaRecorder.start();
    //log
    console.log(this.mediaRecorder.state);

    // this.mediaRecorder.ondataavailable = function (event) {
    //   //   console.log(event.data);
    //   chunks.push(event.data);

    //   //   console.log(chunks);
    // };

    // this.mediaRecorder.onstop = function (evt) {
    //   // Make blob out of our blobs, and open it.

    //   let blob = new Blob(chunks, { type: "audio/ogg; codecs=opus" });

    //   //   console.log(blob);

    //   let audioTag = document.createElement("audio");
    //   document.querySelector("audio").src = URL.createObjectURL(blob);
    // };

    this.osc.frequency.setValueAtTime(150, time);
    this.vol.gain.setValueAtTime(0.25, time);

    this.osc.frequency.exponentialRampToValueAtTime(0.01, time + 0.5);
    this.vol.gain.exponentialRampToValueAtTime(0.01, time + 0.5);
    // console.log("Playing");
    // this.gain.gain.linearRampToValueAtTime(0, time + 0.05);

    this.osc.start(time);

    console.log(this.mediaRecorder);
    this.osc.stop(time + 0.55);
    this.mediaRecorder.requestData();
    console.log(mediaRecorder); // undefined mime type should be audio/ogg
    this.mediaRecorder.stop(time + 0.55);

    //log
    console.log(this.mediaRecorder.state);
    // console.log("Stopped");
  }
}

// wrap the kick class in a function so we can play at any time
function kick() {
  let kick = new Kick(actx);
  let now = actx.currentTime;
  kick.play(now);
  //   // kick.play(now + 0.5);
  //   // kick.play(now + 1);
  //   // kick.play(now + 1.5);
  //   // kick.play(now + 2);
}

// Keyboard controls
window.addEventListener("keydown", keyDownHandler, false);

function keyDownHandler(event) {
  console.log(event);
  if (event.key === "z") {
    kick();
  }
}
