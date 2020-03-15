const nodemailer = require("nodemailer");
require('dotenv').config();


const mail = async (data, term, email) => {


    let transporter = nodemailer.createTransport({
        host: 'smtp.zoho.com',
        port: 587,
        auth: {
           user: process.env.EMAIL,
           pass: process.env.MAILPASS
        }
    });
     

    // Map de los items diferenciados, para poder mostrarlos mejor.
    let html = '<div>' + data.map((item)=> {
        return(
            `<div style="max-width: 200px; background-color: #ccc; border: 1px solid black; margin: 20px 10px">
                <a href="${item.link}">
                <img style="width: 100%; height: 200px; object-fit: cover" src="${item.image}"} />
                </a>
                <h3>${item.title}</h3>
                <p style="font-weight: bold;">${item.price}</p>
                <p>${item.state}, ${item.city}</p>

            </div>`
        )
    }).join('') + '</div>' + "\n";

    // mensaje del nodemailer
    const message = await transporter.sendMail({
        from: process.env.EMAIL, // sender address
        to: email || "martinchammah@gmail.com", // list of receivers
        subject: `New ${term}s of ` + Date(), // Subject line
        html: html
      });

      return message;
    



}


module.exports = mail;