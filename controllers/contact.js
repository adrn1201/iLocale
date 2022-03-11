const nodemailer = require('nodemailer');
const { google } = require('googleapis');

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;
const REFRESH_TOKEN = process.env.REFRESH_TOKEN;

const oAuth2Client = new google.auth.OAuth2(
    CLIENT_ID,
    CLIENT_SECRET,
    REDIRECT_URI
);
oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });


module.exports.renderContact = (req, res) => {
    res.render('contact');
};

module.exports.sendEmail = async(req, res) => {
    let { name, email, message } = req.body.contact;
    name = req.sanitize(name);
    email = req.sanitize(email);
    message = req.sanitize(message);

    const accessToken = await oAuth2Client.getAccessToken();

    const transport = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            type: 'OAuth2',
            user: process.env.SUPERUSER_EMAIL,
            clientId: CLIENT_ID,
            clientSecret: CLIENT_SECRET,
            refreshToken: REFRESH_TOKEN,
            accessToken: accessToken,
        },
    });

    const mailOptions = {
        from: `${name} <${email}>`,
        to: process.env.ADMINISTRATIVE_EMAIL,
        subject: 'iLocale User Concern',
        text: message,
        html: `<strong>${message}</strong>`,
    };

    const result = await transport.sendMail(mailOptions);

    if (result) {
        req.flash('success', 'Thank you for your email, we will get back to you shortly.')
        res.redirect('back');
    } else {
        req.flash('error', 'Sorry, something went wrong!')
        res.redirect('back');
    }
}