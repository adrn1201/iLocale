const User = require('../models/user');

module.exports.renderUserData = async(req, res) => {
    const { page } = req.query;
    if (!page) {
        const allUsers = await User.paginate({ isSuperUser: false });
        res.render('superuser/index', { allUsers });
    } else {
        const allUsers = await User.paginate({ isSuperUser: false }, { page });
        res.status(200).json(allUsers);
    }
}

module.exports.renderEditForm = async(req, res) => {
    const { id } = req.params;
    const foundUser = await User.findById(id);
    res.render('superuser/edit', { foundUser });
}

module.exports.updateUserRole = async(req, res) => {
    const { id } = req.params;
    const user = await User.findByIdAndUpdate(id, req.body.user);
    req.flash('success', `Successfuly Updated ${user.username}'s role`);
    res.redirect('/superuser/users');
}

module.exports.deleteUser = async(req, res) => {
    const { id } = req.params;
    const user = await User.findByIdAndDelete(id);
    req.flash('success', `Successfully Deleted ${user.username}`);
    res.redirect('/superuser/users');
}