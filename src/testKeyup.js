console.log("Tested!!!");

const actx = new AudioContext();

// var to hold the state of key down
// TODO: make this into an array to
// hold the state of all keys pressed
let keyPlaying = false;

function playNote(frequency, key) {
  console.log(keyPlaying);

  let osc, vol;

  // TODO: need to check the exact key state
  if (keyPlaying === false) {
    keyPlaying = true;
    osc = actx.createOscillator();
    vol = actx.createGain();

    osc.frequency.value = frequency;
    osc.type = "sine";
    vol.gain.value = 0.1;

    osc.connect(vol).connect(actx.destination);

    osc.start();
    console.log(keyPlaying);
  }

  //   osc.onended = function () {
  //     console.log("ended");
  //   };
  //   console.log(key, osc);

  // TODO: add event listener to specific key
  // is that possible????
  window.addEventListener("keyup", keyupHandler, false);

  function keyupHandler() {
    osc.stop();

    keyPlaying = false;

    console.log(keyPlaying);
  }
}

document.addEventListener("keypress", keypressHandler, false);

function keypressHandler(event) {
  let key = event.key;
  //   console.log(key);

  // TODO: Check if specific key is still pressed
  if (key === "1" && !keyPlaying) {
    playNote(440, key);
  }
}
