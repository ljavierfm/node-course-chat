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

socket.on('newLocationMessage', function (message) {
    console.log('newLocationMessage', message);

    let li = $('<li></li>');
    let a=$('<a target="_blank">My current location</a>');

    li.text(`${message.from}:`);
    a.attr('href',message.url);
    li.append(a);

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

let locationButton = $('#send-location');

locationButton.on('click',function(){
    if(!navigator.geolocation){
        return alert('Geolocation not supported by your Browser');
    }

    navigator.geolocation.getCurrentPosition(function(position){
        socket.emit('createLocationMessage',{
            latitude:position.coords.latitude,
            longitude:position.coords.longitude
        });
    },function(){
        alert('Unable to fecth location');
    });
});
