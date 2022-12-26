import React from 'react';

import './Input.css';

const Input = ({ message, setMessage, sendMessage }) => {
    return (
        <form className="form">
            <input
                className="input"
                type="text"
                placeholder="Send some Code!"
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                onKeyPress={event => event.key === 'Enter' && sendMessage(event)}
            />
        </form>

    )
}

export default Input;