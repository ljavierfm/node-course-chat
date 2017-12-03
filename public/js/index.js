/*jshint esversion: 6 */
let socket = io();

//No uso funciones flecha para hacerlo compatible en navegadores
socket.on('connect', function() {
    console.log('Connected to server');

    socket.emit('createMessage',{
        from:'Andrew',
        text:'Yup, thats works for me'
    });
});

socket.on('disconnect', function () {
    console.log('Disconnected to server');
});

socket.on('newMessage',function(message){
    console.log('newMessage',message);
})