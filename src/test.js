// Eample 2 from the webAudio api spec editors cut!
/* 
Here’s a more complex example with three sources and a convolution reverb send with a dynamics compressor at the final output stage:
*/

let context;
let compressor;
let reverb;
let source1, source2, source3;
let lowpassFilter;
let waveShaper;
let panner;
let dry1, dry2, dry3;
let wet1, wet2, wet3;
let mainDry;
let mainWet;

function setupRoutingGraph() {
  context = new AudioContext();

  // Create the effects nodes.
  lowpassFilter = context.createBiquadFilter();
  waveShaper = context.createWaveShaper();
  panner = context.createPanner();
  compressor = context.createDynamicsCompressor();
  reverb = context.createConvolver();

  // Create main wet and dry.
  mainDry = context.createGain();
  mainWet = context.createGain();

  // Connect final compressor to final destination.
  compressor.connect(context.destination);

  // Connect main dry and wet to compressor.
  mainDry.connect(compressor);
  mainWet.connect(compressor);

  // Connect reverb to main wet.
  reverb.connect(mainWet);

  // Create a few sources.
  source1 = context.createBufferSource();
  source2 = context.createBufferSource();
  source3 = context.createOscillator();

  source1.buffer = manTalkingBuffer; // these buffers need to be created
  source2.buffer = footstepsBuffer;
  source3.frequency.value = 440;

  // Connect source1
  dry1 = context.createGain();
  wet1 = context.createGain();
  source1.connect(lowpassFilter);
  lowpassFilter.connect(dry1);
  lowpassFilter.connect(wet1);
  dry1.connect(mainDry);
  wet1.connect(reverb);

  // Connect source2
  dry2 = context.createGain();
  wet2 = context.createGain();
  source2.connect(waveShaper);
  waveShaper.connect(dry2);
  waveShaper.connect(wet2);
  dry2.connect(mainDry);
  wet2.connect(reverb);

  // Connect source3
  dry3 = context.createGain();
  wet3 = context.createGain();
  source3.connect(panner);
  panner.connect(dry3);
  panner.connect(wet3);
  dry3.connect(mainDry);
  wet3.connect(reverb);

  // Start the sources now.
  source1.start(0);
  source2.start(0);
  source3.start(0);
}

// window.addEventListener("click", setupRoutingGraph, false);
