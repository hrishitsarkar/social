module.exports.profile = function(req, res){
    return res.render('user_profile',{
        title : 'User'
    });
}
//rendering sign up page
module.exports.signUp = function(req,res){
    return res.render('user_sign_up',{
        title:"Codeial | Sign Up"
    });
}
//rendering sign in page
module.exports.signIn = function(req,res){
    return res.render('user_sign_in',{
        title:"Codeial | Sign In"
    });
}