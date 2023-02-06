console.log("Awsome!");

/*       START - OK HunnyBun!
    We need to do a bit of a re-write to pre-load our audio files
    Of course this was going to happen when you just bang things
    out without thinking things through. Duh!
 */

// get our assets loader so we can pre-load our sound files
import { assets } from "../lib/assets.js";
// console.log(assets);

// path list to audio tracks
// these are going to be our `load params`
const audioPath = [
  "./audio/startRythm.wav",
  "./audio/startAdd-1.wav",
  "./audio/startAdd-2.wav",
  "./audio//startAdd-3-drums.wav",
  "./audio/startAdd-4-bassnotes.wav",
];

function loadTunes() {
  // call the load method of the assets object
  assets.load(audioPath);
}

function loadingThingy() {
  // do a "we are loading thingy"
}

/*      END - OK HunnyBun!
 */

// create an html node list of our tracks
const tracks = document.querySelectorAll("audio");
console.log(tracks);

// create an html collection of our play buttons
const playBtns = document.getElementsByClassName("playBtn");
console.log(playBtns);

// can't iterate over an html collection with `.foreach`
// as we can with a node list, but we can use a `for loop`
for (let i = 0; i < playBtns.length; i++) {
  // add a click event listener to each play button
  playBtns[i].addEventListener("click", btnClicked, false);
  // playBtns[i].addEventListener("mouseover", mouseOver, false);
  // playBtns[i].addEventListener("mouseout", mouseOut, false);

  // add an event listener to each associated audio track
  tracks[i].addEventListener("ended", trackEnded, false);
  console.log(playBtns[i], tracks[i]);
}

function mouseOver(e) {
  // change the colour of the button
  console.log("moused over!");
}

function mouseOut(e) {
  // change the colour of the button
  console.log("moused out!!!");
}

function trackEnded(e) {
  console.log(e.target);
  console.log(parseInt(e.target.id));
  let btn = parseInt(e.target.id);
  tracks[btn].currentTime = 0;
  console.log(tracks[btn].currentTime);
  playBtns[btn].setAttribute("class", "fa solid fa-play playBtn");
}

// toggles the play / pause state and button's icon
function togglePlay(audioTrack, btn) {
  return audioTrack.paused // is the track paused?
    ? // if track paused, play it
      audioTrack.play(
        // set the class attribute on the button
        playBtns[btn].setAttribute("class", "fa solid fa-pause playBtn")
      )
    : // else if track not paused, play it!
      audioTrack.pause(
        // set the class attribute on the button
        playBtns[btn].setAttribute("class", "fa solid fa-play playBtn")
      );

  // audioTrack.play((playBtns[btn].style.color = "var(--clr-btn)"))
  // audioTrack.pause((playBtns[btn].style.color = "var(--clr-green-0"));
}

function btnClicked(e) {
  console.log("button id:", e.target.id);
  let btn = e.target.id;

  if (btn === "playBtn00") togglePlay(tracks[0], btn);
  if (btn === "playBtn01") togglePlay(tracks[1], btn);
  if (btn === "playBtn02") togglePlay(tracks[2], btn);
  if (btn === "playBtn03") togglePlay(tracks[3], btn);
  if (btn === "playBtn04") togglePlay(tracks[4], btn);
}

/* button states

    up - button is up / not playing / not paused
        - action = none
        - colour = "var(--clr-yellow-dusty-1)"
        - state = 0

    over - mouse is over the button
         - action = none
         - colour = "yellow"
         - state = 1

    down1 - button has been clicked
          - action = play
          - clour = "var(--clr-btn)"
          - state = 2

    down2 - button clicked for second time
          - action = pause
          - colour = "green"
          - state = 3

*/
