const nodemailer = require('nodemailer');
const express = require('express');

async function sendEmail(params, callback) {
 var transport = nodemailer.createTransport({
    host: 'smtp-relay.sendinblue.com',
    port: 587,
    auth: {
        user: 'alanashu07@gmail.com',
        pass: 'XNrhY9GpfFAOT20d'
    }
 });

 var mailOptions = {
    from: 'alanashu07@gmail.com',
    to: params.email,
    subject: params.subject,
    text: params.body,
 };

 transporter.sendMail(mailOptions, function(error, info) {
    if(error) {
        return callback(error);
    } else {
        return callback(null, info.response);
    }
 });
}

module.exports = {sendEmail}