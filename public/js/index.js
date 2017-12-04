/*jshint esversion: 6 */
let socket = io();

//No uso funciones flecha para hacerlo compatible en navegadores
socket.on('connect', function() {
    console.log('Connected to server');
});

socket.on('disconnect', function () {
    console.log('Disconnected to server');
});


//Se recibe nuevo mensaje
socket.on('newMessage',function(message){
    let formattedTime=moment(message.createdAt).format('h:mm a');
    
    let li=$('<li></li>');
    li.text(`${message.from} ${formattedTime} : ${message.text}`);

    $('#messages').append(li);
});

//Se recibe nuevo mensaje de localización
socket.on('newLocationMessage', function (message) {
    let formattedTime = moment(message.createdAt).format('h:mm a');

    let li = $('<li></li>');
    let a=$('<a target="_blank">My current location</a>');

    li.text(`${message.from} ${formattedTime} :`);
    a.attr('href',message.url);
    li.append(a);

    $('#messages').append(li);
});

//Comportamiento boton enviar mensaje
$('#message-form').on('submit', function (e) {
    
    e.preventDefault();
    
    let sendButton=$('#send');
    let messageTextBox=$('[name=message]');

    sendButton.attr('disabled', 'disabled').text('Sending');

    socket.emit('createMessage', {
        from: 'User',
        text: messageTextBox.val()
    }, function () {
        messageTextBox.val('');
        sendButton.removeAttr('disabled').text('Send');
    });

});

//Comportamiento al enviar localizacion
let locationButton = $('#send-location');

locationButton.on('click',function(){
    if(!navigator.geolocation){
        return alert('Geolocation not supported by your Browser');
    }

    locationButton.attr('disabled','disabled').text('Sending');

    navigator.geolocation.getCurrentPosition(function(position){
        locationButton.removeAttr('disabled').text('Send location');
        socket.emit('createLocationMessage',{
            latitude:position.coords.latitude,
            longitude:position.coords.longitude
        });
    },function(){
        alert('Unable to fecth location');
    });
});
