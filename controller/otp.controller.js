const otpService = require('../routes/otp.service');
const express = require('express');

otpLogin = (req, res, next) => {
  otpService.sendOTP(req.body, (error, results) => {
    if (error) {
        return res.status(400).send({
            message: "Error",
            data: error
        });
    }
    return res.status(200).send({
       message: "Success",
       data: results,
    });
  });
};

verifyOTP = (req, res, next) => {
  otpService.verifyOTP(req.body, (error, results) => {
    if (error) {
        return res.status(400).send({
            message: "Error",
            data: error
        });
    }
    return res.status(200).send({
       message: "Success",
       data: results,
    });
  });
};

module.exports = {otpLogin, verifyOTP};