const { addUser, removeUser, getUser, getUsersInRoom } = require('../server/users.js');

// addUser
test('add new id', () => {
    
    expect(addUser({id : 3, name : "ViNny", room : "C"})).toStrictEqual({"user": {"id": 3, "name": "vinny", "room": "c"}}  );
});

test('add existing id', () => {
    addUser({id : 3, name : "Michael", room : "C"});
    expect(addUser({id : 3, name : "Michael", room : "C"})).toStrictEqual({"error": "Username is taken"});
});

// removeUser
test('remove correct id', () => {
    addUser({id : 8, name : "jack", room : "d"});
    expect(removeUser(8)).toStrictEqual({"id": 8, "name": "jack", "room": "d"});
});

test('remove non existant id', () => {
    expect(removeUser(12)).toBeUndefined();
});

// getUser
test('get user', () => {
    expect(getUser(12)).toBeUndefined();
});

test('get non existent user', () => {
    addUser({id : 9, name : "Bill", room : "d"});
    expect(getUser(9)).toStrictEqual({"id": 9, "name": "bill", "room": "d"});
});

// getUsersInRoom
test('get user full room', () => {
    expect(getUsersInRoom("c")).toStrictEqual(
        [{"id": 3, "name": "vinny", "room": "c"}, {"id": 3, "name": "michael", "room": "c"}]
    );
});

test('get user empty room', () => {
    expect(getUsersInRoom("i")).toStrictEqual(
        []
    );
});