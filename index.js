const canvasGraphGrid = document.getElementById("canvas_graph_grid");
const canvasGraphFigures = document.getElementById("canvas_graph_figures");
const gridCtx = canvasGraphGrid.getContext("2d");
const figuresCtx = canvasGraphFigures.getContext("2d");

//size of graph
const canvasGraphGridWidth = canvasGraphGrid.clientWidth;
const canvasGraphGridHeight = canvasGraphGrid.clientHeight;

//main variables
let x = 0;
let y = 0;
let r = 1;

// Main axes
const xAxis = canvasGraphGridWidth / 2;
const yAxis = canvasGraphGridHeight / 2;

// size of grid
const scaleX = 50;
const scaleY = 50;

//grid rendering

function gridRendering() {
  let k = 1;

  gridCtx.beginPath();
  gridCtx.strokeStyle = "#000000";
  gridCtx.lineWidth = 0.25;

  for (let i = xAxis; i < canvasGraphGridWidth; i += scaleX) {
    gridCtx.moveTo(i, 0);
    gridCtx.lineTo(i, canvasGraphGridWidth);

    gridCtx.moveTo(i - scaleX * k, 0);
    gridCtx.lineTo(i - scaleX * k, canvasGraphGridWidth);

    gridCtx.moveTo(0, i);
    gridCtx.lineTo(canvasGraphGridHeight, i);

    gridCtx.moveTo(0, i - scaleY * k);
    gridCtx.lineTo(canvasGraphGridHeight, i - scaleY * k);
    k += 2;
  }

  gridCtx.stroke();
  gridCtx.closePath();
}

//drawing main axes

function drawingMainAxes() {
  gridCtx.beginPath();
  gridCtx.strokeStyle = "#000000";
  gridCtx.lineWidth = 1;

  gridCtx.moveTo(xAxis, 0);
  gridCtx.lineTo(xAxis, canvasGraphGridHeight);

  gridCtx.moveTo(0, yAxis);
  gridCtx.lineTo(canvasGraphGridWidth, yAxis);

  gridCtx.stroke();
  gridCtx.closePath();

  let m = -4;

  gridCtx.beginPath();

  gridCtx.font = "16px Arial";
  gridCtx.globalAlpha = 0.4;

  for (let i = 25; i < canvasGraphGridWidth; i += scaleX) {
    gridCtx.fillText(m, i, yAxis);
    gridCtx.fillText(-1 * m, xAxis, i);
    m++;
  }

  gridCtx.closePath();
}

//settings checkboxes
const checkboxes = document.getElementsByClassName("enter_R");

function settingsCheckbox() {
  for (let i = 0; i < checkboxes.length; i++) {
    checkboxes[i].addEventListener("change", function () {
      if (checkboxes[i].checked) {
        for (let j = 0; j < checkboxes.length; j++) {
          if (i != j) {
            checkboxes[j].checked = false;
          }
        }
      }
    });
  }
}

//недопустимость множественного выбора в checkbox
settingsCheckbox();
gridRendering();
drawingMainAxes();

submitButton = document.getElementById("submit_button");

submitButton.onclick = function () {
  settingsCheckbox();
  checkerX = false;
  checkerR = false;

  //кол-во checker-true
  let v = 0;

  // get X
  radioValues = document.getElementsByName("enter_X");
  const textNotificationX = document.getElementById("text_notification_x");

  for (let radio of radioValues) {
    if (radio.checked) {
      checkerX = true;
      v++;
      x = parseFloat(radio.value);
      break;
    }
  }

  if (!checkerX) {
    textNotificationX.style.marginLeft = "50px";
    notificationX.style.display = "block";
    notificationX.style.fontSize = "14px";
    selection_X.style.marginBottom = "0px";
  } else {
    settingParametersHeight(v);
    textNotificationX.style.marginLeft = "50px";
    notificationX.style.display = "none";
    selection_X.style.marginBottom = "10px";
  }

  //get Y

  const textNotificationY = document.getElementById("text_notification_y");
  valueY = parseFloat(document.getElementById("enter_Y").value);

  if (!isNaN(valueY) && !Object.is(valueY, -0)) {
    if (valueY >= -3 && valueY <= 3) {
      v++;
      y = valueY;
      settingParametersHeight(v);
      textNotificationY.style.marginLeft = "50px";
      notificationY.style.display = "none";
      selection_Y.style.marginBottom = "10px";
    } else {
      textNotificationY.textContent = "should be in range[-3, 3]";
      textNotificationY.style.marginLeft = "50px";
      notificationY.style.display = "block";
      notificationY.style.fontSize = "14px";
      selection_Y.style.marginBottom = "0px";
    }
  } else {
    textNotificationY.textContent = "must be a number";
    textNotificationY.style.marginLeft = "70px";
    notificationY.style.display = "block";
    notificationY.style.fontSize = "14px";
    selection_Y.style.marginBottom = "0px";
  }

  //get r

  const textNotificationR = document.getElementById("text_notification_r");

  for (let checkbox of checkboxes) {
    if (checkbox.checked) {
      deleteFigures();
      checkerR = true;
      v++;
      r = parseFloat(checkbox.value);
      break;
    }
  }

  if (!checkerR) {
    textNotificationR.style.marginLeft = "50px";
    notificationR.style.display = "block";
    notificationR.style.fontSize = "14px";
    selection_R.style.marginBottom = "0px";
  } else {
    textNotificationR.style.marginLeft = "50px";
    notificationR.style.display = "none";
    selection_R.style.marginBottom = "10px";
  }

  settingParametersHeight(v);
};

function settingParametersHeight(value) {
  if (value == 3) {
    parameters.style.height = "250px";
    drawingFigure();
    if(x != -5) {
      drawPoint(x, y);
    }
    fetching();
  } else if (value == 2) {
    parameters.style.height = "276px";
  } else if (value == 1) {
    parameters.style.height = "302px";
  } else {
    parameters.style.height = "328px";
  }
}

function fetching() {
  const params = new FormData();
  params.append("x", x);
  params.append("y", y);
  params.append("r", r);

  fetch("script.php", {
    method: "POST",
    body: params,
  })
    .then((response) => response.text())
    .then((data) => {
      document.getElementById("result_table").innerHTML += data;
    });
}

//drawing point
function drawPoint(xCoord, yCoord) {
  xCoord = xCoord * scaleX + xAxis + scaleX;
  yCoord = yCoord * -1 * scaleY + yAxis;
  figuresCtx.beginPath();
  figuresCtx.fillStyle = "#01ff7f";
  figuresCtx.globalAlpha = 1;
  figuresCtx.arc(xCoord, yCoord, 3, 0, 2 * Math.PI);
  figuresCtx.fill();
  figuresCtx.globalAlpha = 0.5;
  figuresCtx.fillStyle = "black";
  figuresCtx.closePath();
}

function drawingFigure() {
  //drawing square
  figuresCtx.beginPath();
  figuresCtx.strokeStyle = "#000000";
  figuresCtx.globalAlpha = 0.5;
  figuresCtx.fillRect(xAxis + scaleX, yAxis, r * scaleX, r * scaleY);
  figuresCtx.closePath();

  //drawing triangle

  figuresCtx.beginPath();
  figuresCtx.moveTo(xAxis + scaleX, yAxis);
  figuresCtx.lineTo(xAxis + scaleX, yAxis + r * scaleY);
  figuresCtx.lineTo(xAxis + scaleX - (r / 2) * scaleY, yAxis);
  figuresCtx.strokeStyle = "#002636";
  figuresCtx.globalAlpha = 0.5;
  figuresCtx.fill();
  figuresCtx.closePath();

  //drawing quadrant of a circle

  figuresCtx.beginPath();
  figuresCtx.strokeStyle = "#002636";
  figuresCtx.globalAlpha = 0.5;
  figuresCtx.moveTo(xAxis + scaleX, yAxis);
  figuresCtx.arc(xAxis + scaleX, yAxis, r * scaleX, 0, (3 * Math.PI) / 2, true);
  figuresCtx.fill();
  figuresCtx.closePath();
}

function deleteFigures() {
  //deleting figures
  figuresCtx.beginPath();
  figuresCtx.clearRect(0, 0, 450, 450);
  figuresCtx.closePath();
}
