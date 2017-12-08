/*jshint esversion: 6 */
/* Parte del cliente */

let socket = io();

function scrollToBottom(){
    //selectors
    let messages=$('#messages');
    let newMessage=messages.children('li:last-child');
    //Heights  
    let clientHeight=messages.prop('clientHeight');
    let scrollTop=messages.prop('scrollTop');
    let scrollHeight=messages.prop('scrollHeight');
    let newMessageHeight=newMessage.innerHeight();
    let lastMessageHeight=newMessage.prev().innerHeight();

    if (clientHeight + scrollTop + newMessageHeight + lastMessageHeight>=scrollHeight){
        messages.animate({ scrollTop: scrollHeight }, 1000);
        return false;
    }
}

//No uso funciones flecha para hacerlo compatible en navegadores
//Se conecta al socket
socket.on('connect', function() {
    let params=jQuery.deparam(window.location.search);

    
    //tercer parametro es el callback que se recibe desde el servidor
    socket.emit('join',params,function(err){
        if (err){
            alert(err);
            window.location.href='/';
        }else{
            console.log('No error');
        }
    });
});

socket.on('disconnect', function () {
    console.log('Disconnected to server');
});

//se actualiza la lista de usuarios del chat
socket.on('updateUserList',function(users){
    let ol=$('<ol></ol>');

    users.forEach(function(user) {
        ol.append($('<li></li>').text(user));
    });

    $('#users').html(ol);
});


//Se recibe nuevo mensaje
socket.on('newMessage',function(message){
    
    let formattedTime = moment(message.createdAt).format('h:mm a');
    let template = $('#message-template').html();
    let html=Mustache.render(template,{
        text:message.text,
        from:message.from,
        createdAt:formattedTime
    });

    $('#messages').append(html);
    scrollToBottom();
});

//Se recibe nuevo mensaje de localización
socket.on('newLocationMessage', function (message) {
    
    let formattedTime = moment(message.createdAt).format('h:mm a');
    let template = $('#location-message-template').html();
    let html=Mustache.render(template,{
        from:message.from,
        createdAt:formattedTime,
        url:message.url
    });

    $('#messages').append(html);
    scrollToBottom();
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
