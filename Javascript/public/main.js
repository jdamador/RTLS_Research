// Global Variables
var tag;
var roomArea;
var dwmSize = 3;

/**
 * Begin a new room.
 */
function saveSettings() {
    tag = new component("red");
    room.start();
    getAnchorsPos();
    initializeZoom();
}
/**
 * Room area simulate the real room.
 */
var room = {
    canvas: document.createElement('canvas'),
    listAnchors: [],
    start: function () {
        // * Create canvas and set settings.
        this.canvas.width = 1085;
        this.canvas.height = 580;
        this.canvas.className = "canvas";
        this.context = this.canvas.getContext("2d");
        // Add to html.
        let parent = document.getElementById('container')
        parent.insertBefore(this.canvas, parent.childNodes[0]);
        //this.interval = setInterval(updateRoomArea, 20);
    },
    clear: function () {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}

/**
 * Create a new Tag
 * @param {*} color 
 */
function component(color) {
    this.x = 0;
    this.y = 0;
    this.color = color;
    this.newPos = function (x, y) {
        this.x = x;
        this.y = y;
    }
    this.update = function () {
        ctx = room.context;
        ctx.save();
        ctx.beginPath();
        ctx.fillStyle = color;
        ctx.arc(this.x, this.y, dwmSize, 0, Math.PI * 2, true);
        ctx.fill();
        ctx.closePath();
        ctx.restore();
    }
}

/**
 * Object to save anchor positions.
 * @param {*} x 
 * @param {*} y 
 */
function anchor(x, y) {
    this.x = x;
    this.y = y;
}

/**
 * Read data from input to create a new anchor.
 */
function getAnchorsPos() {
    room.listAnchors = []
    room.listAnchors.push(new anchor(0, 0));
    let x = document.getElementById('anch2_X').value * 100;
    let y = document.getElementById('anch2_Y').value * 100;
    room.listAnchors.push(new anchor(x, y));
    x = document.getElementById('anch3_X').value * 100;
    y = document.getElementById('anch3_Y').value * 100;
    room.listAnchors.push(new anchor(x, y));
    x = document.getElementById('anch4_X').value * 100;
    y = document.getElementById('anch4_Y').value * 100;
    room.listAnchors.push(new anchor(x, y));
    drawAnchors();
}

/**
 * Draw in the canvas all anchors.
 */
function drawAnchors() {
    ctx = room.context;

    //* Draw lines to connect each anchor.
    ctx.beginPath();
    ctx.moveTo(0, 0);
    for (let index = 1; index < room.listAnchors.length; index++) {
        let x = room.listAnchors[index].x;
        let y = room.listAnchors[index].y
        ctx.lineTo(x, y)
        ctx.moveTo(x, y)
    }
    ctx.lineTo(0, 0);
    ctx.stroke();
    ctx.strokeStyle = "green";
    ctx.closePath();

    // * Draw each anchor.
    ctx.beginPath()
    ctx.fillStyle = "blue";
    room.listAnchors.forEach(i => {
        ctx.arc(i.x, i.y, dwmSize, 0, Math.PI * 2, true);
        ctx.fill();
        ctx.closePath();
    });
}

/**
 * Update the position of the tag.
 * @param {*} x 
 * @param {*} y 
 */
function updateRoomArea(x, y) {
    room.clear();
    drawAnchors();
    tag.newPos(x, y);
    tag.update()
}

/**
 * Listen to each emit from the server.
 */
const socket = io();
socket.on('location', function (data) {
    draw(scale, translatePos, data.location[3] * 100, data.location[4] * 100);
});

var translatePos;
var scale;
/**
 * This function is handle  the zoon 
 */
var initializeZoom = function () {
    var canvas = room.canvas;
    scale = 1.0;
    translatePos = {
        x: canvas.width / 2,
        y: canvas.height / 2
    };

    // Size of each close up.
    var scaleMultiplier = 0.9;
    var startDragOffset = {};
    var mouseDown = false;

    // Add event listeners to handle screen drag
    canvas.addEventListener("mousedown", function (evt) {
        mouseDown = true;
        startDragOffset.x = evt.clientX - translatePos.x;
        startDragOffset.y = evt.clientY - translatePos.y;
    });

    // Add event listener to zooming with mousewheel.
    canvas.addEventListener("mousewheel", (e) => {
        if (e.wheelDelta > 0) {
            scale /= scaleMultiplier;
            draw(scale, translatePos);
        } else {
            scale *= scaleMultiplier;
            draw(scale, translatePos);
        }
    });
    canvas.addEventListener("DOMMouseScroll", (e) => {
        if (e.wheelDelta > 0) {
            scale /= scaleMultiplier;
            draw(scale, translatePos);
        } else {
            scale *= scaleMultiplier;
            draw(scale, translatePos);
        }
    });

    canvas.addEventListener("mouseup", function (evt) {
        mouseDown = false;
    });

    canvas.addEventListener("mouseover", function (evt) {
        mouseDown = false;
    });

    canvas.addEventListener("mouseout", function (evt) {
        mouseDown = false;
    });

    canvas.addEventListener("mousemove", function (evt) {
        if (mouseDown) {
            translatePos.x = evt.clientX - startDragOffset.x;
            translatePos.y = evt.clientY - startDragOffset.y;
            draw(scale, translatePos);
        }
    });

    draw(scale, translatePos);
};
function draw(scale, translatePos, x = tag.x, y = tag.y) {
    var canvas = room.canvas;
    var context = canvas.getContext("2d");
    room.clear()
    context.save();
    context.translate(translatePos.x, translatePos.y);
    context.scale(scale, scale);
    updateRoomArea(x, y);
    context.restore();
}

/**
 * Validate if the input is a number.
 * @param {*} evt 
 */
function validate(evt) {
    var theEvent = evt || window.event;

    // Handle paste
    if (theEvent.type === 'paste') {
        key = event.clipboardData.getData('text/plain');
    } else {
        // Handle key press
        var key = theEvent.keyCode || theEvent.which;
        key = String.fromCharCode(key);
    }
    var regex = /[0-9]|\./;
    if (!regex.test(key)) {
        theEvent.returnValue = false;
        if (theEvent.preventDefault) theEvent.preventDefault();
    }
}