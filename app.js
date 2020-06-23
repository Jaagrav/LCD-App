var canvas = document.querySelector(".canvas");
var ctx = canvas.getContext("2d");

canvas.height = window.innerHeight;
canvas.width = window.innerWidth;

canvas.addEventListener("touchmove", (e) => {
  firebase.database().ref("LiveDraw/Cood").push({
    x: e.touches[0].clientX,
    y: e.touches[0].clientY,
  });
});

firebase
  .database()
  .ref("LiveDraw/Cood")
  .on("child_added", (snapshot) => {
    console.log(snapshot.val());
    ctx.lineWidth = 10;
    ctx.lineCap = "round";
    ctx.lineTo(snapshot.val().x, snapshot.val().y);
    ctx.stroke();
  });

firebase
  .database()
  .ref("LiveDraw/BeginPath")
  .on("child_added", () => {
    ctx.beginPath();
  });

canvas.addEventListener("touchend", () => {
  firebase.database().ref("LiveDraw/BeginPath").push("uyfdavjfs");
});
