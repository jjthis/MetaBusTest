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

function sendMovement() {
    socket.emit('chat message', {
        type: 'move',
        id: id,
        vec: aniOver[id],
        now: pos[id],
        time: (new Date()).toLocaleString().toString()
    });
}

function ChatView(props) {
    const [userList, setUserList] = useState([id, 232]);

    useEffect(() => {
        myEle = document.getElementById(id + "");
        pos[id] = getMyPosition();
        socket.on('response', (data) => {
            console.log(JSON.stringify(data));
            if (data.type === 'join new') {
                let tmp = [...userList];
                tmp.push(data.id);
                aniOver[data.id] = data.vec;
                pos[data.id] = data.now;
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
                setUserList(data.list);
                for (let j = 0; j < data.list.length; j++)animationShow(data.list[j]);
            }
        });
        aniOver[id] = [0, 0, 0, 0];
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
                aniOver[id][0] = 1;
                animationShow(id);
                console.log("PRESS RIGHT");
            } else if (e.key === 'ArrowLeft') {
                aniOver[id][1] = -1;
                animationShow(id);
            } else if (e.key === 'ArrowDown') {
                aniOver[id][2] = 1;
                animationShow(id);
            } else if (e.key === 'ArrowUp') {
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
function animationShow(ids) {

    
    let start = null;
    let pre = null;
    const element = document.getElementById(ids + "");

    function step(timestamp) {
        if (!start) {
            start = timestamp;
            pre = timestamp;
        }
        let progress = timestamp - pre;
        pre = timestamp;
        pos[ids][0] += (aniOver[ids][0] + aniOver[ids][1]) * Math.min(progress, 2000);
        pos[ids][1] += (aniOver[ids][2] + aniOver[ids][3]) * Math.min(progress, 2000);
        element.style.left = pos[ids][0] + "px";
        element.style.top = pos[ids][1] + "px";
        if (aniOver[ids][0] || aniOver[ids][1] || aniOver[ids][2] || aniOver[ids][3]) {
            window.requestAnimationFrame(step);
        } 
    }

    window.requestAnimationFrame(step);

}
export default App;
