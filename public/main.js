
var btnJoin;


var socket = io.connect('http://localhost:3000/');

socket.on('newBall', function (data) {
    addBall(data);

});

socket.on('animate', (data) => {
    
    let ball = ballArray.filter(b => {
        return b.id == data.id;
    })[0];

    ball.x = data.x;
    ball.y = data.y;
    update(ball);
});

socket.on('initBalls', function (data) {
    console.log(data);
    ballArray = data;
});

var canvas = document.getElementById('canvas');
var keyList = [];
window.addEventListener('keydown', (e) => {

    if (e.keyCode == 38) {
        //up
        keyList.push(38);

    }

    if (e.keyCode == 40) {
        //down
        keyList.push(40);

    }

    if (e.keyCode == 37) {
        //left
        keyList.push(37);

    }

    if (e.keyCode == 39) {
        //right
        keyList.push(39);

    }


    travelKeys();
});

function travelKeys() {
    ball = ballArray.filter(s => s.id == socket.id)[0];
    socket.emit('animate',ball);
    keyList.forEach((v, i) => {
        if (v == 38) {
            ball.y -= 10;
        } else if (v == 40) {
            ball.y += 10;
        } else if (v == 37) {
            ball.x -= 10;
        } else if (v == 39) {
            ball.x += 10;
        }
        keyList.shift();
    });

}
canvas.width = innerWidth - 10;
canvas.height = innerHeight - 60;

var ctx = canvas.getContext('2d');
var DEFAULT_RADIUS = 15;
var isStop = false;

function Ball(id) {
    this.id = id;
    this.x = canvas.width / 2,
    this.y = canvas.height / 2
}

function update(ball) {
    this.draw(ball);
}

function draw(ball) {
    ctx.beginPath()
    ctx.arc(ball.x, ball.y, this.DEFAULT_RADIUS, 0, Math.PI * 2, false)
    ctx.fillStyle = 'red';
    ctx.fill();
    ctx.beginPath();
    ctx.fillStyle = 'black';
    ctx.font = '16px serif';
    ctx.fillText(ball.id, ball.x - DEFAULT_RADIUS, ball.y - DEFAULT_RADIUS - 5);
    ctx.fill();

    ctx.closePath()
}

var ball;
var ballArray = [];
function init() {
    animate();
}
function animate() {

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (!isStop) {
        requestAnimationFrame(animate);

        for (let index = 0; index < ballArray.length; index++) {
            update(ballArray[index]);
        }

    }
}
function addBall(id) {
    let ball = new Ball(id);
    ballArray.push(ball);
}

function createOne(){
    let ball = new Ball(socket.id);
    socket.emit('newBall', ball);
    ballArray.push(ball);
}

window.onload = () => {

    btnJoin = document.querySelector('.join');
    init();
    btnJoin.addEventListener('click', () => {
        btnJoin.disabled = true;
        btnJoin.style.opacity = 0.6;
        btnJoin.style.cusror = 'none';
        createOne();
    });

}

