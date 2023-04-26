import logo from './logo.svg';
import React, {useEffect, use, useState} from 'react'
import './App.css';
import { io } from "socket.io-client";
import { v4 as uuidv4 } from 'uuid';
function App() {
  return (
    <div className="App">
      <header className="App-header">
        <ChatView/>
      </header>
    </div>
  );
}
const socket=io("/chat", {
    cors: {
        origin: "http://localhost:8080/chat",
        credentials: true
    },
    transports: ["websocket"],
    query: {
        tenant: 'EGU'
    }
});
const id=uuidv4();
socket.on('response', (data) => {
    console.log(data);
});
function ChatView(props){
    function push(){
        socket.emit('chat message', {
            message: 'hi',
            id: id,
            time:(new Date()).toLocaleString().toString()
        });
    }

    return (<>
        <button onClick={push}>
            hiButton
        </button>
    </>)
}
export default App;
