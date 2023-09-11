const otpGenerator = require('otp-generator');
const express = require('express');
const crypto = require('crypto');
const key = "bluemark123";
const emailServices = require('../routes/emailrequest');

async function sendOTP(params, callback) {
    const otp = otpGenerator.generate(
        4, {
            digits: true,
            upperCaseAlphabets: false,
            specialChars: false,
            lowerCaseAlphabets: false
        }
    );

    const ttl = 15 * 60 * 1000;
    const expires = Date.now() + ttl;
    const data = `${params.email}.${otp}.${expires}`;
    const hash = crypto.createHmac("sha256", key).update(data).digest("hex");
    const fullHash = `${hash}.${expires}`;

    var otpMessage = `Dear Blue Mark Customer, Your OTP for Signing up is ${otp}. Do not share this OTP with anyone!.`;
    var model = {
        email: params.email,
        subject: "Registration OTP",
        body: otpMessage
    };

    emailServices.sendEmail(model, (error, result) => {
        if(error) {
            return callback(error);
        }
        return callback(null, fullHash);
    });
}

async function verifyOTP(params, callback) {
    let[hashValue, expires] = params.hash.split('.');
    let now = Date.now();
    if(now > parseInt(expires)) return callback("OTP Expired! Please Click on Send OTP Again");
    let data = `${params.email}.${params.otp}.${expires}`;
    let newCalculatedHash = crypto.createHmac("sha256", key).update(data).digest("hex");
    if(newCalculatedHash == hashValue) {
        return callback(null, "OTP Verification Success");
    }

    return callback("Invalid OTP!");
}
module.exports = {
    sendOTP, verifyOTP
}