const nodemailer = require('../config/nodemailer');


exports.newComment = (comment) => {
    console.log('inside comments mailer');
    let htmlString = nodemailer.renderTemplate({comment : comment} , '/comments/new_comment.ejs')

    //send mail

    nodemailer.transporter.sendMail({
        from : 'hrishitjohn@gmail.com',
        to: comment.user.email,
        subject : 'new comment published',
        html : htmlString
    },
    (err,info) => {
        if(err) {console.log('error in sending mail',err); return;}
        console.log('message sent',info);
        return;
    })
}