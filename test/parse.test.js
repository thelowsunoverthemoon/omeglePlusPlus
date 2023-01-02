const { parseCode } = require('../server/parse.js');

// prelude test success
test('no exprs', () => {
    expect(parseCode("(5)")).toStrictEqual({"hier": [], "loop": 5});
});

// prelude test error
test('empty', () => {
    expect(() => { parseCode("") }).toThrow("Invalid Character Position in Expression");
});

test('no close paren prelude', () => {
    expect(() => { parseCode("(3") }).toThrow("Reached End of Code unexpectedly");
});

test('invalid loop prelude', () => {
    expect(() => { parseCode("(i)") }).toThrow("Invalid Integer for Parameter");
});

test('no open paren prelude', () => {
    expect(() => { parseCode("i)") }).toThrow("Invalid Character Position in Expression");
});

// expr test success

test('single expr multi arg', () => {
    expect(parseCode("(2) (rect 2 90 10 30 red)")).toEqual(
        {"hier": [{"arg": [2, 90, 10, 30, "red"], "com": "rect"}], "loop": 2}
    );
});

test('single expr one arg', () => {
    expect(parseCode("(2) (even 2)")).toEqual(
        {"hier": [{"arg": [2], "com": "even"}], "loop": 2}
    );
});

test('multi expr', () => {
    expect(parseCode("(2) (rect 2 90 10 30 red) (img 2 3 250 250 img.png)")).toEqual(
        {"hier": [{"arg": [2, 90, 10, 30, "red"], "com": "rect"}, {"arg": [2, 3, 250, 250, "img.png"], "com": "img"}], "loop": 2}
    );
});

test('use t var', () => {
    expect(parseCode("(2) (odd t)")).toEqual(
        {"hier": [{"arg": ["t"], "com": "odd"}], "loop": 2}
    );
});

test('conditional', () => {
    expect(parseCode("(2) (? (even 2) (rect (* 3 20) 90 10 30 red))")).toEqual(
        {"hier": [{"arg": [{"arg": [2], "com": "even"}, {"arg": [{"arg": [3, 20], "com": "*"}, 90, 10, 30, "red"],
        "com": "rect"}], "com": "?"}], "loop": 2}
    );
});

test('dbl conditional', () => {
    expect(parseCode("(2) (? (even 2) (? (even 2) (rect (* 3 20) 90 10 30 red)))")).toEqual(
        {"hier": [{"arg": [{"arg": [2], "com": "even"},
        {"arg": [{"arg": [2], "com": "even"}, {"arg": [{"arg": [3, 20], "com": "*"}, 90, 10, 30, "red"], "com": "rect"}],
        "com": "?"}], "com": "?"}], "loop": 2}
    );
});


// expr test failure
test('no close paren no expr', () => {
    expect(() => { parseCode("(1) (") }).toThrow("Reached End of Code unexpectedly");
});

test('extra close paren no expr', () => {
    expect(() => { parseCode("(1) )") }).toThrow("Invalid Character Position in Expression");
});

test('extra close paren', () => {
    expect(() => { parseCode("(1) (+ 2 3))") }).toThrow("Invalid Character Position in Expression");
});

test('extra close paren multi expr', () => {
    expect(() => { parseCode("(1) (+ 1 (* 6 2)))") }).toThrow("Invalid Character Position in Expression");
});

test('extra open paren multi expr', () => {
    expect(() => { parseCode("(1) (+ 3 ((* 6 2))") }).toThrow("Invalid Function Used");
});

test('missing argument', () => {
    expect(() => { parseCode("(1) (rect 2 3) ") }).toThrow("Missing Object in Expression");
});

test('invalid argument type', () => {
    expect(() => { parseCode("(1) (? true (+ 1 2)) ") }).toThrow("Invalid Function used for Parameter");
});
