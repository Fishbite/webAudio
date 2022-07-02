console.log("testWorklet.js connected");

// Code in the main global scope
class MyWorkletNode extends AudioWorkletNode {
  constructor(actx) {
    super(actx, "my-worklet-processor");
  }
}

const actx = new AudioContext();

actx.audioWorklet.addModule("./src/testProcessor.js").then(() => {
  let node = new AudioWorkletNode(actx, "port-processor");
  //   console.log(node);
  node.port.onmessage = (event) => {
    // handling data from the processor
    console.log(event.data.message);
  };

  node.port.postMessage({ message: "Hello! from node!" });
});
