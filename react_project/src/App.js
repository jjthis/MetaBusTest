import logo from './logo.svg';
import React, { useEffect, use, useState } from 'react'
import './App.css';
import { io } from "socket.io-client";
import { v4 as uuidv4 } from 'uuid';
function App() {
    return (
        <div className="App">
            <header className="App-header">
                <ChatView />
            </header>
        </div>
    );
}

const socket = io("/chat", {
    cors: {
        origin: "http://localhost:8080/chat",
        credentials: true
    },
    transports: ["websocket"],
    query: {
        tenant: 'EGU'
    }
});
const id = uuidv4();

let myEle;
let aniOver = {};
let isRun = {};
let pos = {};
function getMyPosition() {
    return [myEle.getBoundingClientRect().top, myEle.getBoundingClientRect().left];
}
let ballArr={};
function Ball(ids){
    this.id=ids;
    this.pre = null;
}

function sendMovement() {
    socket.emit('chat message', {
        type: 'move',
        id: id,
        vec: aniOver[id],
        now: pos[id],
        time: (new Date()).toLocaleString().toString()
    });
}
let userList=[id];
function ChatView(props) {
    const [us, setUserList] = useState([id]);
    //userList=us;

    useEffect(() => {
        myEle = document.getElementById(id + "");
        pos[id] = getMyPosition();
        socket.on('response', (data) => {
            console.log(JSON.stringify(data));
            if (data.type === 'join new') {
                let tmp = [...userList];
                ballArr[data.id]=new Ball(data.id);
                tmp.push(data.id);
                aniOver[data.id] = data.vec;
                pos[data.id] = data.now;
                userList=tmp;
                setUserList(tmp);
                animationShow(data.id);
            } else if (data.type === 'move') {
                aniOver[data.id] = data.vec;
                pos[data.id] = data.now;
                animationShow(data.id);
            } else if (data.type === 'init') {
                aniOver = data.vecObject;
                pos = data.posObject;
                console.log(JSON.stringify(pos));
                userList=[...data.list];
                console.log(userList);
                setUserList(data.list);
                for (let j = 0; j < data.list.length; j++){
                    ballArr[data.list[j]]=new Ball(data.list[j]);
                    animationShow(data.list[j]);
                }
            }else if(data.type === 'disconnected'){
                let tmp = [...userList];
                if(tmp.indexOf(data.id)==-1)return;
                tmp.splice(tmp.indexOf(data.id), 1);
                userList=tmp;
                setUserList(tmp);
            }
        });
        aniOver[id] = [0, 0, 0, 0];
        ballArr[id]=new Ball(id);
        isRun[id] = false;
        socket.emit('chat message', {
            type: 'join new',
            id: id,
            now: pos[id],
            vec: aniOver[id],
            time: (new Date()).toLocaleString().toString()
        });
        const handleKeyDown = (e) => {
            // 키보드 이벤트 처리
            let isPressed = true;
            if (e.key === 'ArrowRight') {
                if(aniOver[id][0]==1)return;
                aniOver[id][0] = 1;
                animationShow(id);
                console.log("PRESS RIGHT");
            } else if (e.key === 'ArrowLeft') {
                if(aniOver[id][1]==-1)return;
                aniOver[id][1] = -1;
                animationShow(id);
            } else if (e.key === 'ArrowDown') {
                if(aniOver[id][2]==1)return;
                aniOver[id][2] = 1;
                animationShow(id);
            } else if (e.key === 'ArrowUp') {
                if(aniOver[id][3]==-1)return;
                aniOver[id][3] = -1;
                animationShow(id);
            } else {
                isPressed = false;
            }
            if (isPressed) {
                sendMovement();
            }
        }; const handleKeyUp = (e) => {
            // 키보드 이벤트 처리
            let isPressed = true;
            if (e.key === 'ArrowRight') {
                aniOver[id][0] = 0;
            } else if (e.key === 'ArrowLeft') {
                aniOver[id][1] = 0;
            } else if (e.key === 'ArrowDown') {
                aniOver[id][2] = 0;
            } else if (e.key === 'ArrowUp') {
                aniOver[id][3] = 0;
            } else {
                isPressed = false;
            } if (isPressed) {
                sendMovement();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
        };
    }, []);

    return (<>
        {/* <button onClick={push}>
            hiButton
        </button> */}
        <div class='container' >
            {userList.map(x => (<div class="box" id={x}>{x}</div>))}
        </div>
    </>)
}
Ball.prototype.step = function(timestamp) {
    let ids=this.id;
    let element = document.getElementById(ids + "");
    if (!this.pre) {
        this.pre = timestamp;
    }
    let progress = timestamp - this.pre;
    this.pre = timestamp;
    pos[ids][0] += (aniOver[ids][0] + aniOver[ids][1]) * Math.min(progress, 2000);
    pos[ids][1] += (aniOver[ids][2] + aniOver[ids][3]) * Math.min(progress, 2000);
    element.style.left = pos[ids][0] + "px";
    element.style.top = pos[ids][1] + "px";
    if (aniOver[ids][0] || aniOver[ids][1] || aniOver[ids][2] || aniOver[ids][3]) {
        requestAnimationFrame(x=>this.step(x));
    } else{
        isRun[ids]=false;
        console.log("Over "+ids);
    }
}

function animationShow(ids) {

    if(isRun[ids])return;
    isRun[ids]=true;

    ballArr[ids].pre = null;
    
    console.log("start"+ids);
    //ballArr[ids].step();
    //user.loginOk.bind(user)
    requestAnimationFrame(x=>ballArr[ids].step(x));

}
export default App;
