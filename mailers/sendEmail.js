const nodemailer = require('../config/nodemailer');

exports.sendEmail = async (name,email,token) => {
    try {
        await nodemailer.transporter.sendMail({
            from: 'hrishitjohn@gmail.com',
            to: email,
            subject: 'reset password',
            html: '<h1>Hi '+ name +' reset your password by clicking <a href="http://localhost:8000/users/forget-password?token='+token+'">here</h1>'
        },(err,info) => {
            if(err) {console.log('error in sending mail',err); return;}
            console.log('message sent',info);
            return;
        });
        console.log('email sent successfully');
    } catch (err) {
        console.log('error in sending email' , err);
    }


}

