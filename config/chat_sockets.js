// Observer (or) Server
module.exports.chatSockets = function(socketServer){
    let io = require('socket.io')(socketServer, {
        cors: {
          origin: '*',
        }
      });

    io.sockets.on('connection', function(socket){
        console.log('new connection received', socket.id);

        // try it out using refreshing the page
        socket.on('disconnect', function(){
            console.log('socket disconnected!');
        });

        socket.on('join_room', function(data){
            console.log('joining request rece.', data);

            socket.join(data.chatroom);

            // notifying all the users present the chatroom about the new users entry into the chat room
            io.in(data.chatroom).emit('user_joined', data);
        })

        // detect send_message and broadcast to everyone in the room
        socket.on('send_message', function(data){
            io.in(data.chatroom).emit('receive_message', data);
        });
    })
}