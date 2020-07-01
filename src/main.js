// Scripts
import $ from "jquery";
import "jquery-ui/ui/widgets/draggable";
import "jquery-ui/ui/widgets/droppable";
import "./assets/libraries/jquery.ui.touch-punch.min.js";

// Styles
import "normalize.css";
import "./style.sass";

// Images
import headImage from "./assets/images/simplemech-head.svg";
import leg1Image from "./assets/images/simplemech-leg1.svg";
import leg2Image from "./assets/images/simplemech-leg2.svg";
import arm1Image from "./assets/images/simplemech-arm1.svg";
import arm2Image from "./assets/images/simplemech-arm2.svg";
import chestImage from "./assets/images/simplemech-chest.svg";

class svgPart {
  constructor(name, img, nameElementToConnect) {
    this.name = name;
    this.img = img;
    this.domElement = document.createElement("img");
    this.domElement.id = `part_${name}`;
    this.domElement.classList.add("draggable-part");
    this.domElement.src = this.img;
    this.nameElementToConnect = nameElementToConnect;
  }

  set svgParent(svgObject) {
    this._svgParent = svgObject;
  }

  buildInDOM(placeToAppend, svgObject) {
    this.adjustSvgPart({ svgObject });
    document.getElementById(placeToAppend).appendChild(this.domElement);
  }

  adjustSvgPart(params) {
    this.svgParent = params.svgObject || this._svgParent;
    this.svgMeasures = this._svgParent
      .getElementById(this.name)
      .getBoundingClientRect();
    this.domElement.style.width = this.svgMeasures.width + "px";
    this.domElement.style.height = this.svgMeasures.height + "px";
    if (params.dropStatus === "dropped") {
      setTimeout(() => {
        this.domElement.style.left = document.getElementById(
          `torso-${this.name}`
        ).style.left;
        this.domElement.style.top = document.getElementById(
          `torso-${this.name}`
        ).style.top;
      }, 0);
    } else {
      this.domElement.style.left = this.svgMeasures.left + "px";
      this.domElement.style.top = this.svgMeasures.top + "px";
    }
  }

  createDroppablePart(elementToConnect) {
    this.droppableDiv = document.createElement("div");
    this.droppableDiv.id = `torso-${this.name}`;
    this.droppableDiv.classList.add("droppable-part");
    this.adjustDroppablePart(elementToConnect);
    $(this.droppableDiv).droppable({
      accept: "#part_" + this.name,
      tolerance: "touch",
    });
    document.getElementById("droppable-parts").appendChild(this.droppableDiv);
  }

  adjustDroppablePart(elementToConnect) {
    this.elementMeasures = elementToConnect.getBoundingClientRect();
    this.droppableDiv.style.left = this.elementMeasures.left + "px";
    this.droppableDiv.style.top = this.elementMeasures.top + "px";
    this.droppableDiv.style.width = this.svgMeasures.width + "px";
    this.droppableDiv.style.height = this.svgMeasures.height / 3 + "px";
  }
}

let parts = [
  new svgPart("simplemech_xA0_head", headImage, ".st124"),
  new svgPart("simplemech_xA0_leg1", leg1Image, ".st147"),
  new svgPart("simplemech_xA0_leg2", leg2Image, ".st149"),
  new svgPart("simplemech_xA0_arm_1", arm1Image, ".st13"),
  new svgPart("simplemech_xA0_arm_2", arm2Image, ".st126"),
  new svgPart("simplemech_xA0_chest", chestImage, ".st125"),
];

let droppedPositions = {
  part_simplemech_xA0_head: "translate(27%, -105%)",
  part_simplemech_xA0_leg1: "translate(-67%, -6%)",
  part_simplemech_xA0_leg2: "translate(-23%, -7%)",
  part_simplemech_xA0_arm_1: "translate(-89%, -20%)",
  part_simplemech_xA0_arm_2: "translate(8%, -19%)",
  part_simplemech_xA0_chest: "translate(-37%, -36%)",
};

window.addEventListener("load", function () {
  document.body.style.opacity = 1;

  let welcomeOverlay = document.getElementById("welcome-overlay")
    .contentDocument;
  welcomeOverlay.getElementsByTagName("style")[0].innerHTML +=
    " * { cursor: url(cursor-auto.png), auto } #start_x5F_button_xA0_Image * { cursor: url(cursor-pointer.png), pointer } ";

  welcomeOverlay
    .getElementById("start_x5F_button_xA0_Image")
    .addEventListener("click", () => {
      document.getElementById("welcome-screen").classList.add("hide");
      setTimeout(() => {
        document.getElementById("welcome-screen").classList.add("d-none");
      }, 500);
    });

  let hangerSVG = document.getElementById("hanger-svg").contentDocument;
  let torsoSVG = hangerSVG.getElementById("simplemech-torso");
  parts.forEach((part) => {
    part.buildInDOM("draggable-parts", hangerSVG);
    part.createDroppablePart(torsoSVG.querySelector(part.nameElementToConnect));
  });

  $(".draggable-part").draggable({
    containment: "#hanger-container",
    scroll: false,
    revert: "invalid",
  });

  $("#part_simplemech-torso").draggable("destroy");

  let counter = 0;

  $(".droppable-part").on("drop", (event, ui) => {
    $(ui.draggable).draggable("destroy");
    ui.draggable[0].style.left = document.getElementById(
      `torso-${ui.draggable[0].id.slice(5)}`
    ).style.left;
    ui.draggable[0].style.top = document.getElementById(
      `torso-${ui.draggable[0].id.slice(5)}`
    ).style.top;
    ui.draggable[0].style.transform = droppedPositions[ui.draggable[0].id];

    counter++;
    if (counter === parts.length) {
      document.getElementById("success-screen").style.transform = "scale(1)";
    }
  });

  document
    .getElementById("launch-success")
    .contentDocument.getElementsByTagName("style")[0].innerHTML +=
    " * { cursor: url(cursor-auto.png), auto } .st6, .st6 * { cursor: url(cursor-pointer.png), pointer } ";

  document
    .getElementById("launch-success")
    .contentDocument.getElementsByClassName("st6")[0]
    .addEventListener("click", () => {
      document.getElementById("logo-simpleshow").classList.remove("d-none");
      setTimeout(() => {
        document.getElementById("logo-simpleshow").classList.remove("hide");
      }, 100);
    });

  window.onresize = () => {
    parts.forEach((part) => {
      if (part.domElement.classList.contains("ui-draggable")) {
        part.adjustSvgPart({
          dropStatus: "draggable",
        });
      } else {
        part.adjustSvgPart({
          dropStatus: "dropped",
        });
      }
      part.adjustDroppablePart(
        torsoSVG.querySelector(part.nameElementToConnect)
      );
    });
  };
});
