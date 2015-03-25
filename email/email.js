var nodemailer = require('nodemailer');
 
// create reusable transporter object using SMTP transport 
var transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'grass.kw77@gmail.com',
        pass: 'maxgord77'
    }
});



module.exports = function (dst) {
	return {
		SuccessMsg : function() {
			var mailOptions = {
			    from: 'grass.kw77@gmail.com', // sender address 
			    to: dst, // list of receivers 
			    subject: 'Creation de compte', // Subject line 
			    text: 'Felicitation vous avez cree un compte sur mon site', // plaintext body 
			    html: '<p>Felicitation vous avez cree un compte sur mon site</p>' // html body 
			};
			transporter.sendMail(mailOptions, function(error, info){
			if(error){
			    console.log(error);
			}
			else{
			    console.log('Message sent: ' + info.response);
			}
			});
		}
	}
}
