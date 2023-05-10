class ChatEngine{
    
    constructor(chatBoxId, userEmail){
    // console.log(userEmail)
        this.chatBox = $(`#${chatBoxId}`);
        this.userEmail = userEmail;

        this.socket = io.connect('http://localhost:5000');

        if (this.userEmail){
            this.connectionHandler();
        }

    }
 

    connectionHandler(){
        // console.log(this.userEmail)
        let self = this;

        this.socket.on('connect', function(){
            // console.log('connection established using sockets...!');

            self.socket.emit('join_room', {
                user_email: self.userEmail,
                chatroom: 'codeail'
            });

            self.socket.on('user_joined', function(data){
                // console.log('a user joined!', data);
            })

        });

        // CHANGE :: send a message on clicking the send message button
        $('#send-btn').click(function(e){
            e.preventDefault();
            let msg = $('#text-message').val();

            if (msg != ''){
                self.socket.emit('send_message', {
                    message: msg,
                    user_email: self.userEmail,
                    chatroom: 'codeail',
            
                });
            }
        });

        self.socket.on('receive_message', function(data){
            // console.log('message received', data.message);
            // const list = $('.chat-messages-list');

            let newMessage = $('<li>');

            let messageType = 'other-message';

            if (data.user_email == self.userEmail){
                messageType = 'self-message';
            }
            newMessage.append($('<sub>', {
                'html': data.user_email
            }));
            newMessage.append($('<span>', {
                'html': data.message
            }));

           
            newMessage.append($('<hr>'))

            newMessage.addClass(messageType);

            $('#chat-content').append(newMessage);
        
           
        //    $('#chat-message-input').val('')
        })
    }
} 
        