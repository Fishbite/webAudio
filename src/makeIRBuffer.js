/* This program creates a buffer from an Impulse Response recording */
let actx = new AudioContext();

let IRBuffer = null;

function makeIRBuffer(fileURL) {
  console.log("prepping!", fileURL);

  let xhr = new XMLHttpRequest();
  xhr.open("GET", fileURL, true);
  xhr.responseType = "arraybuffer";
  xhr.send();
  xhr.addEventListener("load", onload, false);

  function onload(event) {
    actx.decodeAudioData(
      xhr.response,
      (buffer) => {
        IRBuffer = buffer;
        console.log("IRBuffer", IRBuffer);
        console.log("xhr.response", xhr.response);
        console.log(("IR buffer length", IRBuffer.length));
        // impulseResponse(IRBuffer);
      },

      (error) => {
        throw new Error(`We have an error. No decodie! ${error}`);
      }
    );
  }
}

makeIRBuffer("../audio/IRwav.wav");

// now we can use the IRBuffer in a convolverNode

function impulseResponse(IRBuffer) {
  // set the length to the actual length of the IR buffer
  const length = IRBuffer.length;

  // create an empty buffer (mono i.e. 1 channel) to store the reverb effect
  let impulse = actx.createBuffer(1, length, actx.sampleRate);

  // initialise an array with `getChannelData` to store the mono sound data
  let data = impulse.getChannelData(0);
  console.log(impulse, data);

  return impulse;
}

function impulseResponse(duration = 2, decay = 2, reverse = false) {
  //The length of the buffer
  //(The AudioContext's default sample rate is 44100)
  let length = actx.sampleRate * duration;
  //Create an audio buffer (an empty sound container) to store the reverb effect
  let impulse = actx.createBuffer(2, length, actx.sampleRate);
  //Use `getChannelData` to initialize empty arrays to store sound data for
  //the left and right channels
  let left = impulse.getChannelData(0),
    right = impulse.getChannelData(1);
  //Loop through each sample-frame and fill the channel
  //data with random noise
  for (let i = 0; i < length; i++) {
    //Apply the reverse effect, if `reverse` is `true`
    let n;
    if (reverse) {
      n = length - i;
    } else {
      n = i;
    }
    //Fill the left and right channels with random white noise that
    //decays exponentially
    left[i] = (Math.random() * 2 - 1) * Math.pow(1 - n / length, decay);
    right[i] = (Math.random() * 2 - 1) * Math.pow(1 - n / length, decay);
  }
  //Return the `impulse`
  return impulse;
}
