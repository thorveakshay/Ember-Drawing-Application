var canvas = document.getElementById('drawing');
var context = canvas.getContext('2d');
var flag = false,
  prevX = 0,
  currX = 0,
  prevY = 0,
  currY = 0,
  dot_flag = false

var w, h;

var col = "gray";

//Begin of the canvas implementation.
function findxy(res, e) {
  if (res == 'down') {
    prevX = currX;
    prevY = currY;
    currX = e.clientX; // - canvas.offsetLeft;
    currY = e.clientY; // - canvas.offsetTop;

    flag = true;
    dot_flag = true;
    if (dot_flag) {
      context.beginPath();
      context.fillStyle = col;
      context.fillRect(currX, currY, 2, 2);
      context.closePath();
      dot_flag = false;
    }
  }
  if (res == 'up' || res == "out") {
    flag = false;
  }
  if (res == 'move') {
    if (flag) {
      prevX = currX;
      prevY = currY;
      currX = e.clientX - canvas.offsetLeft;
      currY = e.clientY - canvas.offsetTop;
      draw();
    }
  }
}

function init() {
  //canvas = document.getElementById('drawing');
  //context = canvas.getContext("2d");
  w = canvas.width;
  h = canvas.height;

  //Defining the mouse movemnts for drawing on the canvas
  canvas.addEventListener("mousemove", function(e) {
    findxy('move', e)
  }, false);
  canvas.addEventListener("mousedown", function(e) {
    findxy('down', e)
  }, false);
  canvas.addEventListener("mouseup", function(e) {
    findxy('up', e)
  }, false);
  canvas.addEventListener("mouseout", function(e) {
    findxy('out', e)
  }, false);
}


function draw() {
  context.beginPath();
  context.moveTo(prevX, prevY);
  context.lineTo(currX, currY);
  context.strokeStyle = col;
  context.stroke();
  context.closePath();
}
//Loads the canvas on the page.
window.addEventListener("load", function() {
  var mouse = {
    click: false,
    move: false,
    pos: {
      x: 0,
      y: 0
    },
    pos_prev: false
  };
  // get canvas element and create context
  var canvas = document.getElementById('drawing');
  var context = canvas.getContext('2d');
  var width = window.innerWidth;
  var height = window.innerHeight;
  var socket = io.connect();

  // set canvas to full browser width/height
  //canvas.width = width;
  canvas.width = 800;
  canvas.height = 800;
  //canvas.height = height;

  // register mouse event handlers
  canvas.onmousedown = function(e) {
    mouse.click = true;
  };
  canvas.onmouseup = function(e) {
    mouse.click = false;
  };

  canvas.onmousemove = function(e) {
    // normalize mouse position to range 0.0 - 1.0
    mouse.pos.x = e.clientX / width;
    mouse.pos.y = e.clientY / height;
    mouse.move = true;
  };


  // draw line received from server
  socket.on('draw_line', function(data) {
    var line = data.line;
    context.beginPath();
    context.moveTo(line[0].x * width, line[0].y * height);
    context.lineTo(line[1].x * width, line[1].y * height);
    console.log(col);
    context.strokeStyle = col;
    context.stroke();
  });
  socket.on('erase', function() {
    console.log("I am in erase function")
    context.clearRect(0, 0, canvas.width, canvas.height);
  });

  socket.on('color', function(data) {

    col = data.col;
  });


  // main loop, running every 25ms
  function mainLoop() {
    
    // check if the user is drawing
    if (mouse.click && mouse.move && mouse.pos_prev) {
      console.log('here');
      // send line to to the server
      socket.emit('draw_line', {
        line: [mouse.pos, mouse.pos_prev]
      });
      mouse.move = false;
    }

    mouse.pos_prev = {
      x: mouse.pos.x,
      y: mouse.pos.y
    };

    setTimeout(mainLoop, 25);
  }
  
  mainLoop();
       $("#clr").click(function() {
      socket.emit('erase', {
        line: []
      });
    });
    
    //Handles the switch of the different colors when clicked.
    $(".color_class").click(function() {


      switch (this.id) {
        case "green":
          socket.emit('color', {
            col: 'green'
          });
          break;
        case "blue":
          console.log("blue")
          socket.emit('color', {
            col: 'blue'
          });
          break;
        case "red":
          socket.emit('color', {
            col: 'red'
          });
          break;
        case "yellow":
          socket.emit('color', {
            col: 'yellow'
          });
          break;
        case "orange":
          socket.emit('color', {
            col: 'orange'
          });
          break;
        case "black":
          socket.emit('color', {
            col: 'black'
          });
          break;
        case "white":
          socket.emit('color', {
            col: 'white'
          });
          break;
      }

    });

});
