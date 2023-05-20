// ************* The Musical Notes Bit! START ************ \\
// Some musical note values:
// let C4 = 261.63,
//   D4 = 293.66,
//   E4 = 329.63,
//   F4 = 349.23,
//   G4 = 392,
//   A4 = 440,
//   B4 = 493.88,
//   C5 = 523.25,
//   D5 = 587.33,
//   E5 = 659.25;

// let's calculate the notes instead of hard coding them:
// All the A's A0 to A7
// const A = [];
// for (let i = -4; i < 4; i++) {
//   // multiplying A4 by (a number multiplied by a negative power)
//   // is the same as dividing A4 by a number with a positive power
//   let a = A4 * Math.pow(2, i);

//   A.push(a);
//   // console.log(arrayOfAs.indexOf(a), a);
// }

// for (let i = 0; i < A.length; i++) {
//   let val = A[i];
//   // output the actual index of `val` & its value
//   console.log(A.indexOf(val), val);
// }

// Now we need the octave to fill in the notes between A's

/* Formula to Calculate The Frequencies of Notes of
   The Even Tempered Scale:

   Fn = Fo * (a)^n

   Where Fo = A4 = 440Hz

         n = the number of half steps away from A4
             For notes higher than A4 n is positve
             else lower notes, n is negative

         Fn = the frequency of the note in half steps

         a = (2)^1/12 = 12th root of 2, which is the number which when multiplied by itelf 12 times equals 2 = 1.059463....

    e.g. C5 is 3/12 steps away from A4, thus:

            C5 = Fn = Fo * (a)^n
               = 3/12 steps = 440 * ((2)^1/12)^3 = 523.26...Hz

         C4 is -9/12 steps away from A4, thus:

            C4 = Fn = Fo * (a)^n
               = -9/12 steps = 440 * ((2)^1/12)^-9 = 261.63...Hz

*/

// Class to define an Octave template
class Octave {
  constructor(a) {
    this.C = a * Math.pow(2, -9 / 12);
    this.Cs = a * Math.pow(2, -8 / 12);
    this.D = a * Math.pow(2, -7 / 12);
    this.Ds = a * Math.pow(2, -6 / 12);
    this.E = a * Math.pow(2, -5 / 12);
    this.F = a * Math.pow(2, -4 / 12);
    this.Fs = a * Math.pow(2, -3 / 12);
    this.G = a * Math.pow(2, -2 / 12);
    this.Gs = a * Math.pow(2, -1 / 12);
    this.A = a;
    this.As = a * Math.pow(2, 1 / 12);
    this.B = a * Math.pow(2, 2 / 12);
  }
}

const A4 = 440; // frequency in Hz
let scale = []; // Array to hold all octaves

// Create each octave and push it to the `scale` array
for (let i = -4; i < 4; i++) {
  let a = A4 * Math.pow(2, i);
  let octave = new Octave(a);

  scale.push(octave);
}

// console.log(scale[4].C);
console.log("`scale` array", scale);

// ************* The Musical Notes Bit! END ************ \\

// ************* Keyboard Keys That Play Notes: START ************ \\

// import the variable that holds the value of the
// current octave selected in the UI
import { octaveCurrent } from "./script.js";

// map of keyboard keys to notes in array scale
export const notes = {
  // q: scale[octaveCurrent].C,
  // Use getter functions so that the
  // current value of `octaveCurrent` is read
  get q() {
    console.log(`C${octaveCurrent}`);
    return scale[octaveCurrent].C;
  },
  // 2: scale[octaveCurrent].Cs,
  get 2() {
    console.log(`C${octaveCurrent}#`);
    return scale[octaveCurrent].Cs;
  },
  // w: scale[octaveCurrent].D,
  get w() {
    console.log(`D${octaveCurrent}`);
    return scale[octaveCurrent].D;
  },
  // 3: scale[octaveCurrent].Ds,
  get 3() {
    console.log(`D${octaveCurrent}#`);
    return scale[octaveCurrent].Ds;
  },
  // e: scale[octaveCurrent].E,
  get e() {
    console.log(`E${octaveCurrent}`);
    return scale[octaveCurrent].E;
  },
  // r: scale[octaveCurrent].F,
  get r() {
    console.log(`F${octaveCurrent}`);
    return scale[octaveCurrent].F;
  },
  // 5: scale[octaveCurrent].Fs,
  get 5() {
    console.log(`F${octaveCurrent}#`);
    return scale[octaveCurrent].Fs;
  },
  // t: scale[octaveCurrent].G,
  get t() {
    console.log(`G${octaveCurrent}`);
    return scale[octaveCurrent].G;
  },
  // 6: scale[octaveCurrent].Gs,
  get 6() {
    console.log(`G${octaveCurrent}#`);
    return scale[octaveCurrent].Gs;
  },
  get y() {
    console.log(`A${octaveCurrent}`);
    return scale[octaveCurrent].A;
  },
  // 7: scale[octaveCurrent].As,
  get 7() {
    console.log(`A${octaveCurrent}#`);
    return scale[octaveCurrent].As;
  },
  // u: scale[octaveCurrent].B,
  get u() {
    console.log(`B${octaveCurrent}`);
    return scale[octaveCurrent].B;
  },
  // i: scale[octaveCurrent + 1].C,
  // Note: current octave selected via GUI is keys "q" to "u"
  // & key "i" is the first note of the next octave up
  // so we add 1 to `octaveCurrent` respectively
  get i() {
    console.log(`C${octaveCurrent + 1}`);
    if (scale[octaveCurrent + 1]) return scale[octaveCurrent + 1].C;
  },
  // 9: scale[octaveCurrent + 1].Cs,
  get 9() {
    console.log(`C${octaveCurrent + 1}#`);
    if (scale[octaveCurrent + 1]) return scale[octaveCurrent + 1].Cs;
  },
  // o: scale[octaveCurrent + 1].D,
  get o() {
    console.log(`D${octaveCurrent + 1}`);
    if (scale[octaveCurrent + 1]) return scale[octaveCurrent + 1].D;
  },
  // 0: scale[octaveCurrent + 1].Ds,
  get 0() {
    console.log(`D${octaveCurrent + 1}#`);
    if (scale[octaveCurrent + 1]) return scale[octaveCurrent + 1].Ds;
  },
  // p: scale[octaveCurrent + 1].E,
  get p() {
    console.log(`E${octaveCurrent + 1}`);
    if (scale[octaveCurrent + 1]) return scale[octaveCurrent + 1].E;
  },
};

// ************* Keyboard Keys That Play Notes: END ************ \\
