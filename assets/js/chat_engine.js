class ChatEngine{
    constructor(chatBoxId, userEmail){
        this.chatBox = $(`#${chatBoxId}`);
        this.userEmail = userEmail;

        // io is a gloabl variable as soon as we impledmented the socket.io cdn in home.ejs
        this.socket = io.connect('http://localhost:500');

        if(this.userEmail){
            this.connectionHandler();
        }
    }

    // to & fro interaction btw observer and subscriber
    connectionHandler(){
        let self = this;

        // firing an event - emit
        // receiving an event - on

        this.socket.on('connect', function(){
            console.log('connection established using sockets..!');

            //sending a request to join a virtual chat room
            self.socket.emit('join_room', {
                user_email: self.userEmail,
                chatroom: 'sociocall'
            });

            self.socket.on('user_joined', function(data){
                console.log('a user joined!', data);
            })
        });

        // send a message on clicking the send message button
        $('#send-message').click(function(){
            let msg = $('#chat-message-input').val();

            if (msg != ''){
                self.socket.emit('send_message', {
                    message: msg,
                    user_email: self.userEmail,
                    chatroom: 'sociocall'
                });
            }
        });

        // receiving the message and showing it
        self.socket.on('receive_message', function(data){
            console.log('message received', data.message);


            let newMessage = $('<li>');

            let messageType = 'other-message';

            if (data.user_email == self.userEmail){
                messageType = 'self-message';
            }

            newMessage.append($('<span>', {
                'html': data.message
            }));

            // newMessage.append($('<small>', {
            //     'html': data.user_email
            // }));

            newMessage.addClass(messageType);

            $('#chat-messages-list').append(newMessage);
        })
    }
}