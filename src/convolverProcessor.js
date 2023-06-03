console.log("convolver processor running");

path1 = "../audio/IR-MM-Hall.wav";
path2 = "../audio/IR-Reso-Space.wav";

class ConvolverProcessor extends AudioWorkletProcessor {
  constructor() {
    super();
    this.convolver = null;
  }

  async initializeConvolver() {
    const responseURL = "../audio/IR-MM-Hall.wav";
    const responseBuffer = await fetch(responseURL)
      .then((response) => response.arrayBuffer())
      .then((buffer) => this.port.postMessage(buffer));

    this.convolver = new ConvolverNode(this, { buffer: responseBuffer });

    this.convolver.connect(this.output);
  }

  process(inputs, outputs, parameters) {
    if (!this.convolver) {
      this.initializeConvolver();
    }

    // Process audio here (e.g., connect inputs to the convolver node)

    return true;
  }
}

registerProcessor("convolverProcessor", ConvolverProcessor);
