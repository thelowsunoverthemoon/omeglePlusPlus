import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom'
import io from 'socket.io-client';

import InfoBar from '../InfoBar/InfoBar';
import Input from '../Input/Input';
import Messages from '../Messages/Messages';
import Canvas from '../Canvas/Canvas';

import './Chat.css';

// connection to server
let socket;

const Chat = () => {

    const location = useLocation();
    const navigate = useNavigate();
    const [name] = useState(location.state.name.name);
    const [interest] = useState(location.state.interest.interest);
    const [style] = useState(location.state.style.style);
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const [code, setCode] = useState(null);

    const ENDPOINT = 'localhost:5000';

    useEffect(() => {

        // on startup make socket to server
        socket = io(ENDPOINT);

        // emit a join with data needed for server
        socket.emit('join', { name, style, interest }, (error) => {
            if (error) {
                alert(error);
                socket.disconnect();
                socket.off();
                navigate("/");
            }
        });

        // clean up after refresh/finish running
        return () => {
            socket.disconnect();
            socket.off();
        }
    }, []);

    // run everytime new message
    useEffect(() => {

        // if message from server add message (on means add listener)
        socket.on('message', (message) => {
            setMessages([...messages, message]);
        })

        // dont need so dont listen anymore
        return () => {
            socket.off('message');
        }
    }, [messages]);

    useEffect(() => {
        socket.on('code', (code) => {
            setCode(code);
        })

        return () => {
            socket.off('code');
        }
    }, [code]);

    const sendMessage = (event) => {
        event.preventDefault();

        if (message) {
            socket.emit(message.slice(0, 4) === "\\co " ? 'sendCode' : 'sendMessage', message, () => {
                setMessage('');
            })
        }
    }

    return (
        <div className="outerContainer">
            <Canvas code={code} />
            <div className="container">
                <InfoBar room={`${style} ${interest}`} />
                <Messages messages={messages} name={name} />
                <Input message={message} setMessage={setMessage} sendMessage={sendMessage} />
            </div>
        </div>
    )
}

export default Chat;