var canvas = document.querySelector(".drawing-area");
var ctx = canvas.getContext("2d");
var painting = false;
var color = "#000",
  lastColor = "#000";
var penWidth = 10;

swal({
  text: "Enter you name?",
  content: "input",
  button: {
    text: "Go!",
    closeModal: true,
  },
  allowOutsideClick: false,
  closeOnClickOutside: false,
}).then((value) => {
  var name = value;
  firebase
    .database()
    .ref("Drawing Book/Room324364/userDrawing")
    .set({ name: "" });
  firebase
    .database()
    .ref("Drawing Book/Room324364/Reload")
    .push("Reload Bitch");
  firebase.database().ref("Drawing Book/Room324364/Cood").remove();

  document.querySelector(".container").style.height =
    window.innerHeight - 70 + "px";
  canvas.height = window.innerHeight;
  canvas.width = window.innerWidth;

  window.addEventListener("resize", (e) => {
    document.querySelector(".container").style.height =
      window.innerHeight - 70 + "px";
    canvas.height = window.innerHeight;
    canvas.width = window.innerWidth;
  });

  canvas.ontouchstart = function () {
    painting = true;
  };

  canvas.ontouchend = function () {
    painting = false;
    firebase
      .database()
      .ref("Drawing Book/Room324364/userDrawing")
      .set({ name: "" });
    ctx.beginPath();
    firebase.database().ref("Drawing Book/Room324364/beginPath").push("Ebaba");
  };

  canvas.ontouchmove = function (e) {
    if (!painting) return;
    firebase
      .database()
      .ref("Drawing Book/Room324364/userDrawing")
      .set({ name: name });
    firebase.database().ref("Drawing Book/Room324364/Cood").push({
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
      color: color,
      penWidth: penWidth,
    });
  };

  firebase
    .database()
    .ref("Drawing Book/Room324364/Cood")
    .on("child_added", function (s) {
      ctx.strokeStyle = s.val().color;
      ctx.lineWidth = s.val().penWidth;
      ctx.lineCap = "round";
      ctx.lineTo(s.val().x, s.val().y);
      ctx.stroke();
    });

  var numRel = false;
  firebase
    .database()
    .ref("Drawing Book/Room324364/Reload")
    .on("child_added", function (s) {
      if (numRel) ctx.clearRect(0, 0, canvas.width, canvas.height);
      numRel = true;
    });

  firebase
    .database()
    .ref("Drawing Book/Room324364/beginPath")
    .on("child_added", function (s) {
      ctx.beginPath();
    });

  document.querySelector(".penActive").addEventListener("click", function () {
    document.querySelector(".penActive").style.border = "2px solid black";
    document.querySelector(".eraserActive").style.border = "0";
    color = lastColor;
    penWidth = 10;
  });

  document
    .querySelector(".eraserActive")
    .addEventListener("click", function () {
      document.querySelector(".penActive").style.border = "0";
      document.querySelector(".eraserActive").style.border = "2px solid black";
      color = "#fff";
      penWidth = 50;
    });

  document
    .querySelector(".colorSelect")
    .addEventListener("change", function () {
      color = document.querySelector(".colorSelect").value;
      lastColor = document.querySelector(".colorSelect").value;
      penWidth = 10;
    });

  firebase
    .database()
    .ref("Drawing Book/Room324364/userDrawing")
    .on("child_changed", (s) => {
      console.log(s.val());
      if (s.val() !== "" && s.val() !== name) {
        document.querySelector(".block-drawing").style.display = "block";
        document.querySelector(".whoisdrawing").style.display = "block";
        document.querySelector(".whoisdrawing").innerHTML =
          s.val() + " is drawing...";
      } else {
        document.querySelector(".block-drawing").style.display = "none";
        document.querySelector(".whoisdrawing").style.display = "none";
      }
    });
});
