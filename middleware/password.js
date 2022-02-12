const passwordComplexity = require("joi-password-complexity");
const label = "Password"

const complexityOptions = {
    min: 8,
    max: 20,
    lowerCase: 1,
    upperCase: 1,
    numeric: 1,
    symbol: 1,
    requirementCount: 2,
};

module.exports.validatePassword = (req, res, next) => {
    const { error } = passwordComplexity(complexityOptions, label).validate(req.body.password);
    if (error) {
        const msgs = error.details.map(el => el.message);
        req.flash('passwordError', msgs);
        res.redirect('/signup');
    } else {
        next();
    }
}