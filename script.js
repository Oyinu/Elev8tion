const player = document.getElementById("elev8Player");
const playBtn = document.getElementById("playBtn");
const audioBar = document.getElementById("audioBar");

playBtn.addEventListener("click", () => {

if(player.paused){
player.play();
playBtn.textContent = "⏸ Pause Anthem";
} else {
player.pause();
playBtn.textContent = "▶ Play Anthem";
}

});

player.addEventListener("timeupdate", () => {

const progress =
(player.currentTime / player.duration) * 100;

audioBar.style.width = progress + "%";

});

player.addEventListener("ended", () => {
playBtn.textContent = "▶ Play Anthem";
audioBar.style.width = "0%";
});
