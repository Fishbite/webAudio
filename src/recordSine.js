console.log("Recorder connected.....YippeeAyYaaay!");

/* // ****** LICENSE NOTICE ****** \\
    COPYRIGHT: 2022 Stuart Peel 
    This PROGRAM is distributed under the terms of the:
    AGPL-3.0-or-later
*/

/* ****** Code Below Provided By MDN web docs START ****** 

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
  // osc = ac.createOscillator();
  // osc.frequency.value = 150;

  // create a mediastream destination node
  dest = ac.createMediaStreamDestination();

  // Create a mediaRcorder and connect it to the
  // mdiastream destination node stream
  mediaRecorder = new MediaRecorder(dest.stream);
  // osc.connect(dest);
  // added this so we can hear the sine wave playing live
  // osc.connect(ac.destination);

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

/* ****** Code Above Provided By MDN web docs END ****** */

function setup() {
  ac = new AudioContext();
  dest = ac.createMediaStreamDestination();

  mediaRecorder = new MediaRecorder(dest.stream);

  mediaRecorder.ondataavailable = function (evt) {
    chunks.push(evt.data);
  };

  mediaRecorder.onstop = function (evt) {
    let blob = new Blob(chunks, { type: "audio/ogg; codecs=opus" });
    let audioTag = document.createElement("audio");
    document.querySelector("audio").src = URL.createObjectURL(blob);
  };
}

btn.addEventListener("click", function (e) {
  if (!ac) {
    init();
  }
  // init();

  if (!clicked) {
    mediaRecorder.start();

    playNote(440);

    // osc.start(0);
    e.target.innerHTML = "Stop recording";
    clicked = true;
  } else {
    mediaRecorder.requestData();
    console.log(mediaRecorder);
    mediaRecorder.stop();
    // osc.stop(ac.currentTime);
    e.target.disabled = true;
  }
});

/* ****** Code Above Provided By MDN web docs ****** */
// let actx = new AudioContext();

function playNote(frequency, decay = 1, type = "sine") {
  setup();
  let osc = ac.createOscillator(),
    vol = ac.createGain();

  osc.connect(vol);
  vol.connect(ac.destination); // connect to the speakers
  vol.connect(dest); // connect to the stream

  osc.frequency.value = frequency;

  vol.gain.setValueAtTime(0.1, ac.currentTime);
  vol.gain.linearRampToValueAtTime(0, ac.currentTime + decay);

  osc.start(ac.currentTime);
  osc.stop(ac.currentTime + decay);
}
// blob:http://127.0.0.1:5500/5e72df4e-97a8-4dda-ac5e-861290a49a62

window.addEventListener("keydown", keydownHandler, false);

function keydownHandler(e) {
  ac = new AudioContext();
  dest = ac.createMediaStreamDestination();
  mediaRecorder = new MediaRecorder(dest.stream);
  setup();
  mediaRecorder.start();
  console.log(mediaRecorder);

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
  if (e.key === "1") {
    playNote(440);
    // setTimeout(stopRecording, 1000);
  }

  if (e.key === "2") {
    mediaRecorder.requestData();
    console.log(e.key);
    mediaRecorder.stop();
  }
}

// window.addEventListener("keyup", keyupHandler, false);

function keyupHandler(e) {
  console.log("keyup");
  mediaRecorder.requestData();
  console.log(mediaRecorder);
  mediaRecorder.stop(ac.currentTime + 1000);
}

// playNote(440);

//* ****** Lets see if we can implement this in our kick drum ****** *\\
// Nope, it don't work :-`\

// class Kick {
//   constructor(actx) {
//     this.actx = actx;
//   }
//   setup() {
//     this.osc = this.actx.createOscillator();
//     this.dest = this.actx.createMediaStreamDestination();
//     // console.log("dest", this.dest);
//     this.vol = this.actx.createGain();
//     this.osc.connect(this.vol);
//     this.vol.connect(this.dest);
//     this.vol.connect(this.actx.destination);
//     this.mediaRecorder = new MediaRecorder(this.dest.stream);

//     this.mediaRecorder.ondataavailable = function (event) {
//       //   console.log(event.data);
//       chunks.push(event.data);

//       //   console.log(chunks);
//     };

//     this.mediaRecorder.onstop = function (evt) {
//       // Make blob out of our blobs, and open it.

//       let blob = new Blob(chunks, { type: "audio/ogg; codecs=opus" });

//       //   console.log(blob);

//       let audioTag = document.createElement("audio");
//       document.querySelector("audio").src = URL.createObjectURL(blob);
//     };
//   }
//   play(time) {
//     this.setup();
//     this.mediaRecorder.start();
//     //log
//     console.log(this.mediaRecorder.state);

//     this.osc.frequency.setValueAtTime(150, time);
//     this.vol.gain.setValueAtTime(0.25, time);

//     this.osc.frequency.exponentialRampToValueAtTime(0.01, time + 0.5);
//     this.vol.gain.exponentialRampToValueAtTime(0.01, time + 0.5);
//     // console.log("Playing");
//     // this.gain.gain.linearRampToValueAtTime(0, time + 0.05);

//     this.osc.start(time);

//     console.log(this.mediaRecorder);
//     this.osc.stop(time + 0.55);
//     this.mediaRecorder.requestData();
//     console.log(mediaRecorder); // undefined mime type should be audio/ogg
//     this.mediaRecorder.stop(time + 0.55);

//     //log
//     console.log(this.mediaRecorder.state);
//     // console.log("Stopped");
//   }
// }

// // wrap the kick class in a function so we can play at any time
// function kick() {
//   let kick = new Kick(actx);
//   let now = actx.currentTime;
//   kick.play(now);
//   //   // kick.play(now + 0.5);
//   //   // kick.play(now + 1);
//   //   // kick.play(now + 1.5);
//   //   // kick.play(now + 2);
// }

// // Keyboard controls
// window.addEventListener("keydown", keyDownHandler, false);

// function keyDownHandler(event) {
//   console.log(event);
//   if (event.key === "z") {
//     kick();
//   }
// }
