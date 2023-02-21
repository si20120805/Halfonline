const nodemaielr= require("nodemailer")

const sendmail=async(options)=>{


const transporter= nodemaielr.createTransport({
    host:'smtp.gmail.com',
    port:465,
   

    service:process.env.SERVICE,

    auth:{
        user:process.env.EMAIL,
        pass:process.env.PASSWORD
    }
})

// to whom to send what msg
const mailoption={

     from:process.env.EMAIL,
     to:options.email,
     subject:options.subject,
     text:options.message
}
await transporter.sendMail(mailoption )



}

module.exports=sendmail