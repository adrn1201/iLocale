const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

module.exports.renderContact = (req, res) => {
    res.render('contact');
};

module.exports.sendEmail = async(req, res) => {
    let { name, email, message } = req.body.contact;
    name = req.sanitize(name);
    email = req.sanitize(email);
    message = req.sanitize(message);

    const msg = {
        to: process.env.ADMINISTRATIVE_EMAIL,
        from: email, // Use the email address or domain you verified above
        subject: `iLocale Contact Form Submission from ${name}`,
        text: message,
        html: `<strong>${message}</strong>`,
    };

    try {
        await sgMail.send(msg);
        req.flash('success', 'Thank you for your email, we will get back to you shortly.')
        res.redirect('back');
    } catch (error) {
        console.error(error);
        if (error.response) {
            console.error(error.response.body)
        }
        req.flash('error', 'Sorry, something went wrong!')
        res.redirect('back');
    }
}