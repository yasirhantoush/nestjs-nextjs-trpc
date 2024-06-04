
import { doFail } from "../helpers";
var nodemailer = require('nodemailer');

const NODE_MAILER_FROM_EMAIL = process.env.NODE_MAILER_FROM_EMAIL;
if (!NODE_MAILER_FROM_EMAIL || NODE_MAILER_FROM_EMAIL == '') {
    doFail('NODE_MAILER_FROM_EMAIL env settings not defined', 'ENV_ISSUE', null, null, 500);
}

const NODE_MAILER_SMTP_HOST = process.env.NODE_MAILER_SMTP_HOST;
if (!NODE_MAILER_SMTP_HOST || NODE_MAILER_SMTP_HOST == '') {
    doFail('NODE_MAILER_SMTP_HOST env settings not defined', 'ENV_ISSUE', null, null, 500);
}

const NODE_MAILER_USERNAME = process.env.NODE_MAILER_USERNAME;
if (!NODE_MAILER_USERNAME || NODE_MAILER_USERNAME == '') {
    doFail('NODE_MAILER_USERNAME env settings not defined', 'ENV_ISSUE', null, null, 500);
}

const NODE_MAILER_PASSWORD = process.env.NODE_MAILER_PASSWORD;
if (!NODE_MAILER_PASSWORD || NODE_MAILER_PASSWORD == '') {
    doFail('NODE_MAILER_PASSWORD env settings not defined', 'ENV_ISSUE', null, null, 500);
}


var transporter = nodemailer.createTransport({
    pool: true,
    host: NODE_MAILER_SMTP_HOST,
    port: 465,
    secure: true, // use TLS
    auth: {
        user: NODE_MAILER_USERNAME,
        pass: NODE_MAILER_PASSWORD
    }
});

export async function sendTextEmail(toEmail: string, subject: string, text: string) {
    var mailOptions = {
        from: NODE_MAILER_FROM_EMAIL,
        to: toEmail,
        subject: subject,
        text: text
    };

    transporter.sendMail(mailOptions, function (error: any, info: any) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}

export async function sendHtmlEmail(toEmail: string, subject: string, html: string) {
    var mailOptions = {
        from: NODE_MAILER_FROM_EMAIL,
        to: toEmail,
        subject: subject,
        html: html
    };
    transporter.sendMail(mailOptions, function (error: any, info: any) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}
