import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';

import './Join.css';

import 'bootstrap/dist/css/bootstrap.css';

const Join = () => {
    const [name, setName] = useState('');
    const [style, setStyle] = useState('');
    const [interest, setInterest] = useState('');

    function makeInput(text, func) {
        return (
            <div>
                <input placeholder={text} className="joinInput" type="text" onChange={func} />
            </div>
        );
    }

    function handleInterest(e) {
        setInterest(e);
    }

    function handleStyle(e) {
        setStyle(e);
    }

    function handleName(e) {
        setName(e.target.value);
    }

    function makeDropDown(text, def, options, set) {
        return (
            <DropdownButton id="dropdown" title={text === '' ? def : text} onSelect={set}>
                <>
                    {options.map(
                        (op) => (
                            <Dropdown.Item key={op} eventKey={op}>{op}</Dropdown.Item>
                        )
                    )}
                </>
            </DropdownButton>
        );
    }

    return (
        <div className="joinOuterContainer">
            <div className="joinMatrixBack">
                <div className="joinWhiteBack">
                    <h1 className="heading">omegle++</h1>
                    <div className="joinInnerContainer">

                        {makeInput("Name", handleName)}
                        {makeDropDown(style, "Coding Style?", ["Functional", "Object Oriented", "Procedural", "Symbolic", "All of them!"], handleStyle)}
                        {makeDropDown(interest, "Area of Interest?", ["Embedded", "Data Science", "Business Analysis", "Machine Learning", "Operating Systems", "Webdev", "Other"], handleInterest)}
                        <Link
                            onClick={event => (!name || !style || !interest) && event.preventDefault()}
                            to={`/chat?name=${name}&style=${style}&interest=${interest}`}
                            state={{ name: { name }, style: { style }, interest: { interest } }}
                        >
                            <button className="button mt-20" type="submit">Join!</button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Join;