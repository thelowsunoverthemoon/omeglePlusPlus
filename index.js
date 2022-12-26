const express = require('express');
const http = require('http');

const { addUser, removeUser, getUser, getUsersInRoom } = require('./users.js');
const { parseCode } = require('./parse.js');

const PORT = process.env.PORT || 5000;

const router = require('./router');

const app = express();
const server = http.createServer(app);
const io = require('socket.io')(server, {
    cors: {
        origin: '*',
    }
});

io.on('connection', (socket) => {
    console.log('Connect');

    // from the client we get data
    socket.on('join', ({ name, style, interest }, callback) => {

        // add the user
        let room = style + interest;
        const { error, user } = addUser({ id: socket.id, name, room });
        if (error) {
            return callback(error);
        }

        // emit back to client
        socket.emit('message', { user: '', text: `Welcome ${user.name}!` });
        socket.broadcast.to(user.room).emit('message', { user: '', text: `${user.name} has joined!` });

        // join the user room
        socket.join(user.room);

        callback();
    });

    socket.on('sendMessage', (message, callback) => {
        const user = getUser(socket.id);

        // to everyone in room send message
        io.to(user.room).emit('message', { user: user.name, text: message });

        callback();
    });

    socket.on('sendCode', (message, callback) => {
        const user = getUser(socket.id);

        try {
            const parse = parseCode(message.substring(4));
            io.to(user.room).emit('code', parse);
        } catch (err) {
            io.to(user.room).emit('message', { user: 'compiler', text: `${user.name}, ${err}` });
        }

        callback();
    });

    socket.on('disconnect', () => {
        console.log('Left');
        const user = removeUser(socket.id);

        // if valid user, tell everyone left
        if (user) {
            io.to(user.room).emit('message', { user: 'admin', text: `${user.name} has left` });
        }
    });
});

app.use(router);

server.listen(PORT, () => console.log(`server on port ${PORT}`));