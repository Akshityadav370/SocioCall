const nodemailer = require("../config/nodemailer");

const newComment = (comment) => {
  console.log("inside newComment mailer");

  nodemailer.transporter.sendMail(
    {
      from: "akshit07032001@gmail.com",
      to: comment.user.mail,
      subject: "New Comment Published!",
      html: "<h1>Yup, your comment is now published!</h1>",
    },
    (err, info) => {
      if (err) {
        console.log("Error in sending mail", err);
        return;
      }

      console.log("Message sent", info);
      return;
    }
  );
};

module.exports = newComment;
