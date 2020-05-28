const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_KEY);
const welcomeMessage = (email,name)=>{
  const msg = {
    to: email,
    from: process.env.PRIVATE_EMAIL,
    subject: `Welocme ${name}`,
    text: `Hello ${name}To Our App How Can I Help You`    
  };
  sgMail.send(msg)
}
const seeuMessage = (email,name)=>{
  const msg = {
    from:process.env.PRIVATE_EMAIL,
    to:email,
    subject: 'Unsuscribe From Service',
    text: `Hope You Like Our Service See You Soon${name}`    
  }
  sgMail.send(msg)

}

module.exports = {
  welcomeMessage,
  seeuMessage

}