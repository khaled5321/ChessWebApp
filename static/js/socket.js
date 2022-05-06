socket.on('connect', function() {
    socket.emit('message', {data: 'I\'m connected!'});
});

socket.on('message', data=> {
    console.log(data)
});