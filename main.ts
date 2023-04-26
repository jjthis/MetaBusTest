const express = require('express');
const path = require('path');
const app = express();
const server = require('http').createServer(app);
// http server를 socket.io server로 upgrade한다
const io = require('socket.io')(server);

app.use(express.static(path.join(__dirname, 'react_project/build')));

app.get('/', function (req:any, res:any) {
    res.sendFile(path.join(__dirname, '/react-project/build/index.html'));
});

var chat = io.of('/chat').on('connection', function(socket:any) {
    socket.on('chat message', function(data:any){
        console.log('message from client: ', data);

        // var name = socket.name = data.name;
        // var room = socket.room = data.room;
        //
        // // room에 join한다
        // socket.join(room);
        // room에 join되어 있는 클라이언트에게 메시지를 전송한다
        // chat.to(room).emit('chat message', data.msg);
        // chat.all.emit('response',data);
        socket.broadcast.emit('response',data);
    });
});
server.listen(8080, function() {
    console.log('Socket IO server listening on port ');
});