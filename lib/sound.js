// Sound functions to handle the web audio API

// Create the audio context
let actx = new AudioContext();

// This code outputs the actual destination of the sound: speakers
console.log(actx.destination.channelInterpretation);

// The Sound class
class Sound {
  constructor(source, loadHandler) {
    // assign the source and loadHandler to this object
    (this.source = source), (this.loadHandler = loadHandler);

    // *** set the default set the default properties *** \\
    this.actx = actx;
    this.panNode = this.actx.createStereoPanner();
    this.volumeNode = this.actx.createGain();
    // Echo effect nodes
    this.delayNode = this.actx.createDelay();
    this.feedbackNode = this.actx.createGain();
    this.filterNode = this.actx.createBiquadFilter();
    // Reverb effect node
    this.convolverNode = this.actx.createConvolver();
    this.soundNode = null;
    this.buffer = null;
    this.loop = false;
    this.playing = false;

    // values for the pan and volumne getter and setters
    this.panValue = 0;
    this.volumeValue = 1;

    // values to help to track and set the start and pause values
    this.startTime = 0;
    this.startOffset = 0;

    // additional special effects
    // playback speed: 1 = normal speed
    this.playbackRate = 1;

    // Echo Properties
    this.echo = false;
    this.delayValue = 0.3;
    this.feedbackValue = 0.3;
    this.filterValue = 0; // zero = no filter effect

    // Reverb properties
    this.reverb = false;
    this.reverbImpulse = null;

    // load the sound
    this.load();
  }

  // the `Sound` object's methods
  load() {
    // Use xhr to load the sound file
    let xhr = new XMLHttpRequest();
    xhr.open("GET", this.source, true);
    xhr.responseType = "arraybuffer";
    xhr.addEventListener("load", () => {
      // decode the sound and store a reference to the buffer
      this.actx.decodeAudioData(
        xhr.response,
        (buffer) => {
          this.buffer = buffer;
          this.hasLoaded = true;

          // this next bit is optional but important.
          // If you have a load manager, call it here, so that
          // the sound is registered as loaded
          if (this.loadHandler) {
            this.loadHandler();
          }
        },

        // Throw an error if the sound can't be loaded
        (error) => {
          throw new Error(`Audio could not be decoded ${error}`);
        }
      );
    });

    // send the request to load the file
    xhr.send();
  }

  play() {
    // set the start time, it will be zero when the first sound starts
    this.startTime = this.actx.currentTime;

    // create a sound node
    this.soundNode = this.actx.createBufferSource();

    // set the sound node's buffer property to the loaded sound
    this.soundNode.buffer = this.buffer;

    // create the node connection chain
    this.soundNode.connect(this.volumeNode);
    // if reverb is false, bypass the convolver node
    //If there's no reverb, bypass the convolverNode
    if (this.reverb === false) {
      this.volumeNode.connect(this.panNode);
    }
    //If there is reverb, connect the `convolverNode` and apply
    //the impulse response
    else {
      this.volumeNode.connect(this.convolverNode);
      this.convolverNode.connect(this.panNode);
      this.convolverNode.buffer = this.reverbImpulse;
    }
    this.panNode.connect(this.actx.destination);

    // Optional Echo
    if (this.echo) {
      // Set the values
      this.feeedbackNode.gain.value = this.feedbackValue;
      this.delayNode.delayTime = this.delayValue;
      this.filterNode.frequency.value = this.filterValue;

      // The delay loop with optional filtering
      this.delayNode.connect(this.feedbackNode);
      if (this.filterValue > 0) {
        this.feedbackNode.connect(this.filterNode);
        this.filterNode.connect(this.delayNode);
      } else {
        this.feedbackNode.connect(this.delayNode);
      }

      // Capture the sound from the main node chain, send it to
      // the delay loop and send the final echo to the panNode,
      // which will then route it to the destination node
      this.volumeNode.connect(this.delayNode);
      this.delayNode.connect(this.panNode);
    }

    // will the sound loop? This can be true or false
    this.soundNode.loop = this.loop;

    // Set the sound buffer source's `playbackRate.value`
    this.soundNode.playbackRate.value = this.playbackRate;

    // Finally, use the start() method to play the sound.
    // The start time will be zero or,
    // a later time if the sound was paused
    this.soundNode.start(
      this.startTime,
      this.startOffset % this.buffer.duration
    );

    // Set playing to true to help control
    // the pause and restart methods
    this.playing = true;
  }

  // Use setEcho like this:
  // theSound.setEcho(delayValue, feedbackValue, optional feedbackValue)
  // i.e. theSound.setEcho(0.2, 0.5, 1000);
  // to turn the echo effect off at some point:
  // theSound.echo = false;
  setEcho(delayValue = 0.3, feedbackValue = 0.3, filterValue = 0) {
    this.delayValue = delayValue;
    this.feedbackValue = feedbackValue;
    this.filterValue = filterValue;
    this.echo = true;
  }

  // A method to let use the reverb effect on any sound
  setReverb(duration = 2, decay = 2, reverse = false) {
    this.reverbImpulse = impulseResponse(duration, decay, reverse);
    this.reverb = true;
  }

  pause() {
    // Pause the sound if its playing and calculate
    // the startOffset to save the current position
    if (this.playing) {
      this.soundNode.stop(this.actx.currentTime);
      this.startOffset += this.actx.currentTime - this.startTime;
      this.playing = false;
    }
  }

  restart() {
    // Stop the sound if its playing, reset the start and offset times,
    // then call the play method again
    if (this.playing) {
      this.soundNode.stop(this.actx.currentTime);
    }
    this.startOffset = 0;
    this.play();
  }

  playFrom(value) {
    if (this.playing) {
      this.soundNode.stop(this.actx.currentTime);
    }

    this.startOffset = value;
    this.play();
  }

  stop() {
    if (this.playing) {
      this.soundNode.stop(this.actx.currentTime);
    }
    this.startOffset = 0;
    this.playing = false;
  }

  // volume and pan getters and setters
  get volume() {
    return this.volumeValue;
  }

  set volume(value) {
    this.volumeNode.gain.value = value;
    this.volumeValue = value;
  }

  get pan() {
    return this.panNode.pan.value;
  }

  set pan(value) {
    this.panNode.pan.value = value;
  }
}

// A high level wrapper to keep our general API consistent and flexible
export function makeSound(source, loadHandler) {
  return new Sound(source, loadHandler);
}

/*
The trick to creating believable reverb is that you combine two sounds together.
The first sound is your original sound, without reverb. The second is a special recording of a neutral sound
(white noise) in the kind of acoustic space that you want to simulate: for example, a room, cave, or theatre.
These special recordings are called impulse response recordings. You then blend these two sounds together
using an audio processor called a convolver. The convolver takes your original sound, compares it to the
impulse response recording, and combines the two sounds together. The result is realistic reverb which
sounds like the space that you’re trying to simulate. 
*/

export function impulseResponse(duration = 2, decay = 2, reverse = false) {
  //Var to store  the length of the buffer
  //AudioContext's default sample rate is 44100
  let length = actx.sampleRate * duration;

  // create an audio buffer (an empty sound container)
  // to store the reverb effect
  let impulse = actx.createBuffer(2, length, actx.sampleRate);

  // Use getChannelData to initialise empty arrys to
  // store sound data for
  let left = impulse.getChannelData(0),
    right = impulse.getChannelData(1);

  // loop through each sample frame and fill the
  // channel with random noise
  for (let i = 0; i < length; i++) {
    // if reverse is true apply the reverse effect
    let n;
    if (reverse) {
      n = length - i;
    } else {
      n = i;
    }

    // fille the left and right channels with random
    // white noise that decays exponentially
    left[i] = (Math.random() * 2 - 1) * Math.pow(1 - n / length, decay);

    right[i] = Math.random() * 2 * Math.pow(1 - n / length, decay);
  }

  // return  the impulse
  return impulse;
}

// A function to create sound effects
// Note: the sounds created with this function connect
// directly to the baseAudioContext destination and thus
// could overload the destination when multiple voices
// are played at the same time. To overcome this problem,
// we would need to connect all outputs to a global
// DynamicsComporessor() which in turn is connected to
// the destination
export function soundEffect(
  frequencyValue,
  attack = 0,
  decay = 1,
  type = "sine",
  volumeValue = 1,
  panValue = 0,
  wait = 0,
  pitchBendAmount = 0,
  reverse = false,
  randomValue = 0,
  dissonance = 0,
  echo = undefined,
  reverb = undefined
) {
  //Create oscillator, gain and pan nodes, and connect them
  //together to the destination
  let oscillator = actx.createOscillator(),
    volume = actx.createGain(),
    pan = actx.createStereoPanner();

  oscillator.connect(volume);
  volume.connect(pan);
  pan.connect(actx.destination);

  //Set the supplied values
  volume.gain.value = volumeValue;
  pan.pan.value = panValue;
  oscillator.type = type;

  //Optionally randomize the pitch. If the `randomValue` is greater
  //than zero, a random pitch is selected that's within the range
  //specified by `frequencyValue`. The random pitch will be either
  //above or below the target frequency.
  let frequency;
  let randomInt = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };
  if (randomValue > 0) {
    frequency = randomInt(
      frequencyValue - randomValue / 2,
      frequencyValue + randomValue / 2
    );
  } else {
    frequency = frequencyValue;
  }
  oscillator.frequency.value = frequency;

  //Apply effects
  if (attack > 0) fadeIn(volume);
  if (decay > 0) fadeOut(volume);
  if (pitchBendAmount > 0) pitchBend(oscillator);
  if (echo) addEcho(volume);
  if (reverb) addReverb(volume);
  if (dissonance > 0) addDissonance();

  //Play the sound
  play(oscillator);

  //The helper functions:

  //Reverb
  function addReverb(volumeNode) {
    let convolver = actx.createConvolver();
    convolver.buffer = impulseResponse(reverb[0], reverb[1], reverb[2]);
    volumeNode.connect(convolver);
    convolver.connect(pan);
  }

  //Echo
  function addEcho(volumeNode) {
    //Create the nodes
    let feedback = actx.createGain(),
      delay = actx.createDelay(),
      filter = actx.createBiquadFilter();

    //Set their values (delay time, feedback time and filter frequency)
    delay.delayTime.value = echo[0];
    feedback.gain.value = echo[1];
    if (echo[2]) filter.frequency.value = echo[2];

    //Create the delay feedback loop, with
    //optional filtering
    delay.connect(feedback);
    if (echo[2]) {
      feedback.connect(filter);
      filter.connect(delay);
    } else {
      feedback.connect(delay);
    }

    //Connect the delay loop to the oscillator's volume
    //node, and then to the destination
    volumeNode.connect(delay);

    //Connect the delay loop to the main sound chain's
    //pan node, so that the echo effect is directed to
    //the correct speaker
    delay.connect(pan);
  }

  //Fade in (the sound’s “attack”)
  function fadeIn(volumeNode) {
    //Set the volume to 0 so that you can fade in from silence
    volumeNode.gain.value = 0;

    volumeNode.gain.linearRampToValueAtTime(0, actx.currentTime + wait);
    volumeNode.gain.linearRampToValueAtTime(
      volumeValue,
      actx.currentTime + wait + attack
    );
  }

  //Fade out (the sound’s “decay”)
  function fadeOut(volumeNode) {
    volumeNode.gain.linearRampToValueAtTime(
      volumeValue,
      actx.currentTime + attack + wait
    );
    volumeNode.gain.linearRampToValueAtTime(
      0,
      actx.currentTime + wait + attack + decay
    );
  }

  //Pitch bend.
  //Uses `linearRampToValueAtTime` to bend the sound’s frequency up or down
  function pitchBend(oscillatorNode) {
    //Get the frequency of the current oscillator
    let frequency = oscillatorNode.frequency.value;

    //If `reverse` is true, make the sound drop in pitch.
    //(Useful for shooting sounds)
    if (!reverse) {
      oscillatorNode.frequency.linearRampToValueAtTime(
        frequency,
        actx.currentTime + wait
      );
      oscillatorNode.frequency.linearRampToValueAtTime(
        frequency - pitchBendAmount,
        actx.currentTime + wait + attack + decay
      );
    }

    //If `reverse` is false, make the note rise in pitch.
    //(Useful for jumping sounds)
    else {
      oscillatorNode.frequency.linearRampToValueAtTime(
        frequency,
        actx.currentTime + wait
      );
      oscillatorNode.frequency.linearRampToValueAtTime(
        frequency + pitchBendAmount,
        actx.currentTime + wait + attack + decay
      );
    }
  }

  //Dissonance
  function addDissonance() {
    //Create two more oscillators and gain nodes
    let d1 = actx.createOscillator(),
      d2 = actx.createOscillator(),
      d1Volume = actx.createGain(),
      d2Volume = actx.createGain();

    //Set the volume to the `volumeValue`
    d1Volume.gain.value = volumeValue;
    d2Volume.gain.value = volumeValue;

    //Connect the oscillators to the gain and destination nodes
    d1.connect(d1Volume);
    d1Volume.connect(actx.destination);
    d2.connect(d2Volume);
    d2Volume.connect(actx.destination);

    //Set the waveform to "sawtooth" for a harsh effect
    d1.type = "sawtooth";
    d2.type = "sawtooth";

    //Make the two oscillators play at frequencies above and
    //below the main sound's frequency. Use whatever value was
    //supplied by the `dissonance` argument
    d1.frequency.value = frequency + dissonance;
    d2.frequency.value = frequency - dissonance;

    //Apply effects to the gain and oscillator
    //nodes to match the effects on the main sound
    if (attack > 0) {
      fadeIn(d1Volume);
      fadeIn(d2Volume);
    }
    if (decay > 0) {
      fadeOut(d1Volume);
      fadeOut(d2Volume);
    }
    if (pitchBendAmount > 0) {
      pitchBend(d1);
      pitchBend(d2);
    }
    if (echo) {
      addEcho(d1Volume);
      addEcho(d2Volume);
    }
    if (reverb) {
      addReverb(d1Volume);
      addReverb(d2Volume);
    }

    //Play the sounds
    play(d1);
    play(d2);
  }

  //The `play` function that starts the oscillators
  function play(oscillatorNode) {
    oscillatorNode.start(actx.currentTime + wait);
  }
}
