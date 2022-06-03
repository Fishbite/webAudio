console.log("test.js connected");

const actx = new AudioContext();

let recorder = false;
let recordingStream = false;

function startRecoding() {
  recordingStream = actx.createMediaStreamDestination();
  recorder = new MediaRecorder(recordingStream.stream);
  recorder.start();
}

function stopRecording() {
  recorder.addEventListener("dataavailable", function (e) {
    console.log(e.data);
    document.getElementById("audiotag").src = URL.createObjectURL(e.data);
    recorder = false;
    recordingStream = false;
  });
  recorder.stop();
}

function play(source) {
  let audio = new Audio(source);
  let mediaSource = actx.createMediaElementSource(audio);

  mediaSource.connect(actx.destination);
  mediaSource.connect(recordingStream);
  audio.play();
}

function playNote(frequency, decay = 1, type = "sine") {
  let osc = actx.createOscillator(),
    vol = actx.createGain();

  osc.connect(vol);
  vol.connect(actx.destination);

  osc.frequency.value = frequency;

  vol.gain.linearRampToValueAtTime(0.1, actx.currentTime);
  if (vol.gain.value > 0) {
    console.log("Arse");
  }
  vol.gain.linearRampToValueAtTime(0, actx.currentTime + decay);

  //   if (vol.gain.value < 0.09) {
  //     console.log("Hole");
  //   }

  //   osc.start(actx.currentTime);

  startRecoding();
  play(osc.start(0));
  //   stopRecording();
}

window.addEventListener("keydown", keydownHandler, false);

function keydownHandler(e) {
  if (e.key === "1") {
    playNote(440);
    // setTimeout(stopRecording, 1000);
  }
}
