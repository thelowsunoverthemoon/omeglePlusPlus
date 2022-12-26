const Param = {
    Int: "int",
    Str: "str",
    Col: "col",
    Bool: "bool",
    Void: "void"
};

const Error = {
    CodeEnd: "Reached End of Code unexpectedly",
    MissingChar: "Invalid Character Position in Expression",
    LostObj: "Missing Object in Expression",
    InvCom: "Invalid Function Used",
    ParamInt: "Invalid Integer for Parameter",
    ParamTime: "Invalid Usage of Time for Parameter",
    ParamCol: "Invalid Colour for Parameter",
    ParamBool: "Invalid Boolean for Parameter",
    ParamAngle: "Invalid Angle for Parameter",
    ParamRet: "Invalid Function used for Parameter"
};

const Commands = new Map([
    ["even", { ret: Param.Bool, param: [Param.Int] }],
    ["odd", { ret: Param.Bool, param: [Param.Int] }],
    ["?", { ret: Param.Void, param: [Param.Bool, Param.Void] }],
    ["!", { ret: Param.Void, param: [Param.Bool, Param.Void] }],
    ["=", { ret: Param.Bool, param: [Param.Int, Param.Int] }],
    ["*", { ret: Param.Int, param: [Param.Int, Param.Int] }],
    ["+", { ret: Param.Int, param: [Param.Int, Param.Int] }],
    ["-", { ret: Param.Int, param: [Param.Int, Param.Int] }],
    ["/", { ret: Param.Int, param: [Param.Int, Param.Int] }],
    ["rect", { ret: Param.Void, param: [Param.Int, Param.Int, Param.Int, Param.Int, Param.Col] }],
    ["img", { ret: Param.Void, param: [Param.Int, Param.Int, Param.Str] }],
    ["circle", { ret: Param.Void, param: [Param.Int, Param.Int, Param.Int, Param.Int, Param.Int, Param.Bool, Param.Col] }],
    ["line", { ret: Param.Void, param: [Param.Int, Param.Int, Param.Int, Param.Int, Param.Col] }]
]);

const parseCode = (message) => {
    const parsed = { loop: 0, hier: [] };
    const code = { str: message, ind: 0 };

    parsePrelude(code, parsed);
    parseMain(code, parsed.hier);

    return parsed;
}

function parseMain(code, parsed) {
    while (code.ind != code.str.length) {
        parseExpr(code, parsed);
    }
}

function parsePrelude(code, parsed) {
    moveToChar(code, '(');

    let obj = moveToObj(code);
    parsed.loop = parseType(Param.Int, obj);

    moveToChar(code, ')');
}

function parseExpr(code, hier) {
    moveToChar(code, '(');

    let com = moveToObj(code);
    getRetType(com);

    parseCom(com, code, hier);

    moveToChar(code, ')');

    return com;
}

function parseParam(param, code, arg) {
    for (const p of param) {
        let str = moveToObj(code);

        let isExpr = false;

        if (str === "t") {
            if (!(p === Param.Int)) {
                throw Error.ParamTime;
            }
            arg.push(str);
        } else {
            if (str.charAt(0) == '(') { // nested epxr
                let obj = getFullExpr(code);
                str += obj;
                isExpr = true;
            }
            let val = parseType(p, str, isExpr, arg);

            if (isExpr) {
                checkRetType(val, p);
            } else {
                arg.push(val);
            }
        }

    }
}

function checkRetType(com, p) {
    let ret = getRetType(com);

    if (ret != p) {
        throw Error.ParamRet;
    }
}

function getRetType(com) {
    if (Commands.get(com) == undefined) {
        throw Error.InvCom;
    }

    return Commands.get(com).ret;
}

function parseType(type, str, isExpr, arg) {

    if (isExpr) {
        return parseExpr({ str: str, ind: 0 }, arg); // ret type
    }

    switch (type) {
        case Param.Int:
            let val = parseInt(str, 10);
            if (isNaN(val)) {
                throw Error.ParamInt;
            }
            return val;
        case Param.Bool:
            let cmp = str.toLowerCase();
            if (cmp === "false") {
                return false;
            } else if (cmp === "true") {
                return true;
            } else {
                throw Error.ParamBool;
            }
        case Param.Col:
            let col = ["black", "white", "pink", "brown", "orange", "yellow", "blue", "red", "green"];
            if (!col.includes(str.toLowerCase())) {
                throw Error.ParamCol;
            }
            return str;
        case Param.Str:
            return str;
    }
}

function getFullExpr(code) {
    let obj = "";

    while (true) {

        let ch = getChar(code);
        obj += ch;
        incStr(code);
        if (ch == ')') {
            return obj;
        }

        if (code.ind == code.str.length) {
            throw Error.CodeEnd;
        }
    }
}

function parseCom(com, code, hier) {
    if (Commands.get(com) == undefined) {
        throw Error.InvCom;
    }

    let entry = { com: com, arg: [] };

    parseParam(Commands.get(com).param, code, entry.arg);

    hier.push(entry);
}

function moveToObj(code) {

    skipWhiteSpace(code);
    let obj = "";

    let parenLvl = 0;
    let hasParen = false;
    while (true) {

        let ch = getChar(code);

        if (ch == '(') {
            parenLvl++;
            hasParen = true;
        } else if (ch == ')') {
            if (hasParen) {
                parenLvl--;
            }
        }

        if (parenLvl == 0 && ((ch == ' ') || (ch == '\t') || (ch == '\n') || (ch == ')'))) {
            if (obj == "") {
                throw Error.LostObj;
            }
            return obj;
        }

        obj += ch;
        incStr(code);

        if (code.ind == code.str.length) {
            throw Error.CodeEnd;
        }
    }
}

function moveToChar(code, chara) {
    skipWhiteSpace(code);

    if (getChar(code) != chara) {
        throw Error.MissingChar;
    }

    incStr(code);
}

function skipWhiteSpace(code) {

    while (true) {

        let ch = getChar(code);
        if (!((ch == ' ') || (ch == '\t') || (ch == '\n'))) {
            return;
        }

        incStr(code);
        if (code.ind == code.str.length) {
            throw Error.CodeEnd;
        }
    }
}

function incStr(code) {
    code.ind++;
}

function getChar(code) {
    return code.str[code.ind];
}

module.exports = { parseCode };