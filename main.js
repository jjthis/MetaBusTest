var express = require('express');
var path = require('path');
var app = express();
var server = require('http').createServer(app);
// http server를 socket.io server로 upgrade한다
var io = require('socket.io')(server);
app.use(express.static(path.join(__dirname, 'react_project/build')));
app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, '/react-project/build/index.html'));
});
let joinList=[];
let pos={};
let vec={};

const rl = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  
  rl.on('line', (line) => {
    try{
        console.log(eval(line)+"");

    }catch(e){
        console.log(e+"");
    }
    //rl.close();
  }).on('close', () => {
    //process.exit();
  });

var chat = io.of('/chat').on('connection', function (socket) {
    //let myId;
    socket.on('chat message', function (data) {
        console.log('message from client: ', data);
        pos[data.id]=data.now;
        vec[data.id]=data.vec;
        if(data.type === 'join new'){
            socket.myId=data.id;
            joinList.push(data.id);
            socket.emit('response', {type:'init',list:joinList,posObject:pos,vecObject:vec});
        }
        // var name = socket.name = data.name;
        // var room = socket.room = data.room;
        //
        // // room에 join한다
        // socket.join(room);
        // room에 join되어 있는 클라이언트에게 메시지를 전송한다
        // chat.to(room).emit('chat message', data.msg);
        // chat.all.emit('response',data);
        socket.broadcast.emit('response', data);
    });
    socket.on('disconnect', () => {
        socket.broadcast.emit('response', {type:'disconnected', id:socket.myId});
        console.log("discon "+socket.myId);
        if(joinList.indexOf(socket.myId)==-1)return;
        joinList.splice(joinList.indexOf(socket.myId), 1);
      });
    ////hi
});
server.listen(8080, function () {
    console.log('Socket IO server listening on port ');
});
