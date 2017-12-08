/*jshint esversion: 6 */

/* Parte del servidor*/ 

/*
io.emit - sends to all connected users

socket.emit - sends to current connected user

socket.broadcast.emit - sends to all connected users but the initiator
*/

//imports
const path=require('path');
const http=require('http');
const express=require('express');
const socketIO=require('socket.io');
const { generateMessage, generateLocationMessage}=require('./utils/message');
const {isRealString}=require('./utils/validation');
const {Users}=require('./utils/users');

//public path
const publicPath=path.join(__dirname,'../public');
//puerto para heroku o para default
const port=process.env.PORT||3000;
//inicializa Users
let users=new Users();

//Creates an Express application
const app=express();

const server=http.createServer(app);
const io=socketIO(server);

//middleware. serves static files
app.use(express.static(publicPath));

//Fired upon a connection from client
io.on('connection',(socket)=>{
    console.log('New user connected');

    //Se dispara cuando alguien se une desde login
    socket.on('join',(params,callback)=>{
        if (!(isRealString(params.name)) || !(isRealString(params.room))){
            console.log(`${params.name} y ${params.room}`)
            callback('Name and room are required');
        }

        //Adds the client to the room, and fires optionally a callback with err signature (if any).
        socket.join(params.room);
        //Se borra el usuario de otras salas anteriores
        users.removeUser(socket.id);
        users.addUser(socket.id,params.name,params.room);

        //Emitimos el evento que se actualizo la lista de usuarios al cliente
        io.to(params.room).emit('updateUserList',users.getUsersList(params.room));

        //Admin text Welcome to the chat app
        socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chat app'));

        //Admin sends new user Connect message to all users in the room
        socket.broadcast.to(params.room).emit('newMessage',generateMessage('Admin',`${params.name} has joined`));
        
        callback();
    });
    
    //Se dispara cuando llega un evento desde un cliente tipo createMesage
    socket.on('createMessage',(message,callback)=>{
        console.log('createMessage',message);

        //transmite un evento a cada una de las conexiones establecidas
        io.emit('newMessage', generateMessage(message.from,message.text));

        callback();
    });

    //Se dispara cuando alguien envia localizacion
    socket.on('createLocationMessage',(coords,callback)=>{
        io.emit('newLocationMessage', generateLocationMessage('Admin',coords.latitude,coords.longitude));
        callback();
    });

    //El usuario se desconecta
    socket.on('disconnect',()=>{
        let user=users.removeUser(socket.id);

        if(user){
            io.to(user.room).emit('updateUserList', users.getUsersList(user.room));
            io.to(user.room).emit('newMessage',generateMessage('Admin',`${user.name} has left the room`));
        }
    });
});

//Start de server
server.listen(port,()=>{
    console.log(`Server starting at ${port}`);
});





