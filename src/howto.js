console.log("Awsome!");

// create an html node list of our tracks
const tracks = document.querySelectorAll("audio");
console.log(tracks);

// create an html collection of our play buttons
const playBtns = document.getElementsByClassName("playBtn");
console.log(playBtns);

// can't iterate over an html collection with `.foreach`
// as we can with a node list, but we can use a `for loop`
for (let i = 0; i < playBtns.length; i++) {
  // playBtns[btn].addEventListener("click", handleClick, false);

  // add an event listener to each play button
  playBtns[i].addEventListener("click", handleClick, false);

  // add event listener to each associated audio track
  tracks[i].addEventListener("ended", handleEnded, false);
  console.log(playBtns[i], tracks[i]);
}

function handleEnded(e) {
  console.log(parseInt(e.target.id));
  let btnNum = parseInt(e.target.id);
  return (playBtns[btnNum].style.color = "var(--clr-yellow-dusty-1)");
}

// toggles the play / pause state and button colour
function togglePlay(audioTrack, btn) {
  return audioTrack.paused
    ? audioTrack.play((playBtns[btn].style.color = "var(--clr-btn)"))
    : audioTrack.pause((playBtns[btn].style.color = "var(--clr-green-0"));
}

// tracks[0].onplaying = action();
// playBtns[0].style.color = "var(--clr-yellow-dusty-1)";
//playBtns[0].style.color = "var(--clr-btn)";

function handleClick(e) {
  console.log("button id:", e.target.id);
  let btn = e.target.id;

  if (btn === "playBtn00") togglePlay(tracks[0], btn);
  if (btn === "playBtn01") togglePlay(tracks[1], btn);
  if (btn === "playBtn02") togglePlay(tracks[2], btn);
  if (btn === "playBtn03") togglePlay(tracks[3], btn);
  if (btn === "playBtn04") togglePlay(tracks[4], btn);
}

// const playBtn00 = document.getElementById("playBtn00");
// // .addEventListener("click", handleClick, false);
// playBtn00.addEventListener("click", handleClick, false);
