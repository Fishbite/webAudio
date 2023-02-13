// Use this file to create an audio context that
// you need to use with modules that need one
// i.e. a module that needs a global audio context

const actx = new AudioContext();

const mainVol = actx.createGain();

mainVol.connect(actx.destination);
