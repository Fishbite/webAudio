/* // ****** LICENSE NOTICE ****** \\
      COPYRIGHT: 2020 Stuart Peel 
      This PROGRAM is distributed under the terms of the:
      AGPL-3.0-or-later

      What does this  mean? Well, basically it free!
      Do what you want with it:

        Use it
        Modify it
        Give it away as a freebee!
        Sell it
        Distribute it
      
      If you modify it, please make it available to everyone, 
      it's part of the license T's & C's

      // ****** LICENSE NOTICE ****** \\
*/
// Use this file to create an audio context that
// you need to use with modules that need one
// i.e. a module that needs a global audio context

const actx = new AudioContext();

const mainVol = actx.createGain();

mainVol.connect(actx.destination);
