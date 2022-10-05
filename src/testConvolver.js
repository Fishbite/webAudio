console.log("convolver connected");
let audioCtx = new window.AudioContext();

async function createReverb() {
  let convolver = audioCtx.createConvolver();

  // load impulse response from file
  let response = await fetch("../audio/IRwav2.wav");
  let arraybuffer = await response.arrayBuffer();
  convolver.buffer = await audioCtx.decodeAudioData(arraybuffer);

  return convolver;
}

// …

let reverb = await createReverb();
let osc = audioCtx.createOscillator();
let osc2 = audioCtx.createOscillator();
let vol = audioCtx.createGain();
let volOsc = audioCtx.createGain();
let volOsc2 = audioCtx.createGain();
osc.type = "sawtooth";
osc2.type = "triangle";

osc.frequency.value = 261;
osc2.frequency.value = 260;

vol.gain.value = 0.1;

volOsc.gain.value = 0.08;
volOsc2.gain.value = 0.1;

// someOtherAudioNode -> reverb -> destination
osc.connect(volOsc).connect(vol);
osc2.connect(volOsc2).connect(vol);
vol.connect(reverb).connect(audioCtx.destination);
// osc2.connect(reverb).connect(audioCtx.destination);
// osc.connect(osc2).connect(audioCtx.destination);

window.addEventListener("click", () => {
  osc2.start();
  osc.start();
});
