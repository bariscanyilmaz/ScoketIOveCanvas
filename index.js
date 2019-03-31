const express=require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

const balls = [];

app.use(express.static(__dirname+'/public'))

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {

    socket.emit('initBalls', balls);

    socket.on('newBall', (data) => {
        const userData = {
            id: data.id,
            x: data.x,
            y: data.y
        }
        
        balls.push(userData);
        socket.broadcast.emit('initBalls', balls);

    });

    socket.on('disconnect', () => {

        let ball = balls.filter(b => {
            return b.id == socket.id;
        });
        ball = ball[0];

        let index = balls.indexOf(ball);
        if (index > -1) {
            balls.splice(index, 1);
        }

    });

    socket.on('animate', (data) => {
        try {

            let ball = balls.filter(b => {
                return b.id == socket.id;
            })[0];
            
            ball.x=data.x;
            ball.y=data.y;

            socket.broadcast.emit('animate', ball);

        } catch (error) {

        }

    })

});


http.listen(3000, () => {
    console.log('listening on *:3000');
});