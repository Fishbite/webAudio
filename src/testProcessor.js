/*
    This is 'processor.js' file, eveluated in
    AudioWorkletGlobalScope upon
    audioWorklet.addModule() call in the
    main global scope
*/
class MyWorkletProcessor extends AudioWorkletProcessor {
  constructor() {
    super();
  }

  /* AudioWorkletProcessor.process() method */
  process(inputs, outputs, parameters) {
    // audio processing code here.
    // The processor may have multiple inputs and
    // outputs. Get the first input and output.
    const input = inputs[0];
    const output = outputs[0];

    // Each input or output may have multiple
    // channels. Get the first channel.
    const inputChannel0 = input[0];
    const outputChannel0 = output[0];

    // get the parameter value array
    const myParamValues = parameters.myParam;

    // Simple gain (multiplication) processing
    // over a render quantum (128 samples). This
    // processor only supports the mono channel.
    for (let i = 0; i < inputChannel0.length; i++) {
      outputChannel0 = inputChannel0[i] * myParamValues[i];
    }

    // to keep this processor alive return `true`
    /*  the return value of the process() method
can be used to control the lifetime of AudioWorkletNode
so that developers can manage the memory footprint. To
keep the processor alive, the method must return true. Otherwise, the processor will be garbage collected by the system eventually after the node gets collected. */
    return true;
  }
}

registerProcessor("my-worklet-processor", MyWorkletProcessor);

class PortProcessor extends AudioWorkletProcessor {
  constructor() {
    super();
    this.port.onmessage = (event) => {
      // handling data from the node.
      console.log(event.data.message);
    };

    this.port.postMessage({ message: "Hi! from processor" });
  }

  process(inputs, outputs, parameters) {
    // do nothing, producing silent ouput.
    return true;
  }
}

registerProcessor("port-processor", PortProcessor);
/* note that MessagePort supports Transferable, which
allows you to transfer data storage or a WebAssembly module over the thread boundary. [6] This opens up countless
possibilities on how the AudioWorklet system can be utilized.
*/
