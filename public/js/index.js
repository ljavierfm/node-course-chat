/*jshint esversion: 6 */
let socket = io();

//No uso funciones flecha para hacerlo compatible en navegadores
socket.on('connect', function() {
    console.log('Connected to server');
});

socket.on('disconnect', function () {
    console.log('Disconnected to server');
});

socket.on('newMessage',function(message){
    console.log('newMessage',message);
    
    let li=$('<li></li>');
    li.text(`${message.from}: ${message.text}`);

    $('#messages').append(li);
});

$('#message-form').on('submit', function (e) {
    
    e.preventDefault();

    socket.emit('createMessage', {
        from: 'User',
        text: $('[name=message]').val()
    }, function (string) {
        console.log(string);
    });

});
