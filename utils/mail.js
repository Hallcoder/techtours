require('dotenv').config();
const mailer = require('nodemailer');
module.exports.mail = async(receiver,subject,html,text) => {
    try {
        const transporter = mailer.createTransport({
          host: "smtp.gmail.com",
          service:"gmail",
          secure:true,
          port:465,
          auth: {
            user: "hallcoder25@gmail.com",
            pass: process.env.EMAIL_PASSWORD,
          },
          tls: {
            rejectUnauthorized: false,
          },
        });
          console.log('Sending email....');
          let info = await transporter.sendMail({
              from:'From TechTours Inc.<versusbet@versus.com>',
              to:receiver,
              subject,
              html,
              text
          }) 
          console.log(info)
          if(info)  return true;
      } catch (error) {
        console.log(error);
        return false; 
      }
       
}
