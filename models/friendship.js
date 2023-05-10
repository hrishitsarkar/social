const mongoose = require('mongoose');

const friendshipSchema = new mongoose.Schema({

    //the one who sends the friend req
    from_user : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User'
    },
    //the one who got that req
    to_user : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User'
    },
    friendName : {
        type : String,
        required : true
    }
},{
    timestamps : true
});

const Friendship = mongoose.model('Friendship',friendshipSchema);

module.exports = Friendship;