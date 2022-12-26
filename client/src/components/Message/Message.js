import React from 'react';

import './Message.css';

const MsgType = {
    User: 0,
    Other: 1,
    Compiler: 2,
    Chat: 3
};

const Message = ({ message: { user, text }, name }) => {
    let msgType = MsgType.Other;

    const trimName = name.trim().toLowerCase();

    if (user === trimName) {
        msgType = MsgType.User;
    } else if (user === '') {
        msgType = MsgType.Chat;
    } else if (user === 'compiler') {
        msgType = MsgType.Compiler;
    }


    switch (msgType) {
        case MsgType.User:
            return (
                <div className="messageContainer justifyEnd">
                    <p className="sentText pr-10">{trimName}</p>
                    <div className="messageBox backgroundBlue">
                        <p className="messageText colorWhite">{text}</p>
                    </div>
                </div>
            )
        case MsgType.Chat:
            return (
                <div className="messageContainer justifyStart">
                    <div className="messageBox backgroundTrans">
                        <p className="messageText colorBold">{text}</p>
                    </div>
                    <p className="sentText pl-10">{user}</p>
                </div>
            )
        case MsgType.Compiler:
            return (
                <div className="messageContainer justifyStart">
                    <div className="messageBox backgroundRed">
                        <p className="messageText colorWhite">{text}</p>
                    </div>
                    <p className="sentText pl-10">{user}</p>
                </div>
            )
        default:
            return (
                <div className="messageContainer justifyStart">
                    <div className="messageBox backgroundLight">
                        <p className="messageText colorDark">{text}</p>
                    </div>
                    <p className="sentText pl-10">{user}</p>
                </div>
            )
    }

}

export default Message;