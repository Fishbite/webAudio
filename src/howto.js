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
// and it's gonna save us some typing lol!
const audioPath = [
  "../audio/startRythm.wav",
  "../audio/startAdd-1.wav",
  "../audio/startAdd-2.wav",
  "../audio//startAdd-3-drums.wav",
  "../audio/startAdd-4-bassnotes.wav",
];

const btnDownload = document.getElementById("downloadBtn");
btnDownload.addEventListener("click", loadTunes, false);

const loadingSpan = document.getElementById("loadingSpan");

function loadTunes() {
  loadingSpan.innerText = "Loading...";
  // call the load method of the assets object
  assets.load(audioPath).then(() => setup());
}

/*      END - OK HunnyBun!
 */

function setup() {
  // tell the user we are loaded
  loadingSpan.innerText = "Loaded Dude!!";

  btnDownload.classList.remove("fa-download");
  btnDownload.classList.add("fa-thumbs-up");
  btnDownload.style.fontSize = "2rem";

  // create our playable sound objects
  // use like this: track[0].play()
  const track = [
    assets[audioPath[0]],
    assets[audioPath[1]],
    assets[audioPath[2]],
    assets[audioPath[3]],
    assets[audioPath[4]],
  ];

  // create an html collection of our play buttons
  const playBtns = document.getElementsByClassName("playBtn");
  console.log(playBtns);

  // can't iterate over an html collection with `.foreach`
  // as we can with a node list, but we can use a `for loop`
  for (let i = 0; i < playBtns.length; i++) {
    // add a click event listener to each play button
    playBtns[i].addEventListener("click", btnClicked, false);

    // add an event listener to each associated audio track
    // track[i].addEventListener("ended", trackEnded, false);
    // console.log(playBtns[i], track[i]);
  }

  // function trackEnded(e) {
  //   console.log(e.target);
  //   console.log(parseInt(e.target.id));
  //   let btn = parseInt(e.target.id);
  //   track[btn].currentTime = 0;
  //   console.log(track[btn].currentTime);
  //   playBtns[btn].setAttribute("class", "fa-solid fa-play playBtn");
  // }

  // toggles the play / pause state and button's icon
  function togglePlay(audioTrack, btn) {
    return audioTrack.playing
      ? audioTrack.pause(
          // set the class attribute on the button
          playBtns[btn].setAttribute("class", "fa solid fa-play playBtn")
        )
      : // else if track not paused, play it!
        audioTrack.playFrom(
          0,
          // set the class attribute on the button
          playBtns[btn].setAttribute("class", "fa solid fa-stop playBtn")
        );
  }

  function btnClicked(e) {
    console.log("button id:", e.target.id);
    let btn = e.target.id;

    if (btn === "playBtn00") togglePlay(track[0], btn);
    if (btn === "playBtn01") togglePlay(track[1], btn);
    if (btn === "playBtn02") togglePlay(track[2], btn);
    if (btn === "playBtn03") togglePlay(track[3], btn);
    if (btn === "playBtn04") togglePlay(track[4], btn);
  }
}
