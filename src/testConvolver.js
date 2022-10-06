console.log("convolver connected");
let actx = new window.AudioContext();

async function createReverb() {
  let convolver = actx.createConvolver();

  // load impulse response from file
  let response = await fetch("../audio/IRwav2.wav");
  let arraybuffer = await response.arrayBuffer();
  convolver.buffer = await actx.decodeAudioData(arraybuffer);

  return convolver;
}

// …

let reverb = await createReverb();
let osc = actx.createOscillator();
let osc2 = actx.createOscillator();
let vol = actx.createGain();
let volOsc = actx.createGain();
let volOsc2 = actx.createGain();
osc.type = "sine";
osc2.type = "triangle";

osc.frequency.value = 110;
osc2.frequency.value = osc.frequency.value + 1;

vol.gain.value = 1;

// volOsc.gain.value = 0.08;
// volOsc2.gain.value = 0.2;

// someOtherAudioNode -> reverb -> destination
osc.connect(volOsc).connect(vol);
osc2.connect(volOsc2).connect(vol);
vol.connect(reverb).connect(actx.destination);
// vol.connect(actx.destination);

window.addEventListener("click", () => {
  osc.start();
  osc2.start();

  volOsc.gain.setValueAtTime(0.08, actx.currentTime);
  volOsc.gain.exponentialRampToValueAtTime(0.008, actx.currentTime + 1);

  volOsc2.gain.setValueAtTime(0.2, actx.currentTime);
  volOsc2.gain.exponentialRampToValueAtTime(0.02, actx.currentTime + 1);

  volOsc.gain.linearRampToValueAtTime(0, actx.currentTime + 2.5);
  volOsc2.gain.linearRampToValueAtTime(0, actx.currentTime + 2.5);
});
