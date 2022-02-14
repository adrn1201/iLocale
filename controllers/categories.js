const Category = require('../models/category');

module.exports.index = async(req, res) => {
    const { page } = req.query;
    if (!page) {
        const allCategories = await Category.paginate({});
        res.render('categories/index', { allCategories });
    } else {
        const allCategories = await Category.paginate({}, { page });
        res.status(200).json(allCategories);
    }
}

module.exports.renderNewForm = (req, res) => {
    res.render('categories/new');
}

module.exports.createCategory = async(req, res) => {
    const { categoryName } = req.body.category;
    const category = new Category({ categoryName: categoryName.toLowerCase(), author: req.user._id });
    await category.save();
    req.flash('success', 'Successfully Created New Category');
    res.redirect('/admin/categories');
}

module.exports.renderEditForm = async(req, res) => {
    const { id } = req.params;
    const category = await Category.findById(id);
    res.render('categories/edit', { category });
}

module.exports.updateCategory = async(req, res) => {
    const { id } = req.params;
    await Category.findByIdAndUpdate(id, req.body.category);
    req.flash('success', 'Successfuly Updated Category');
    res.redirect('/admin/categories');
}

module.exports.deleteCategory = async(req, res) => {
    const { id } = req.params;
    await Category.findByIdAndDelete(id);
    req.flash('success', 'Successfully Deleted Category');
    res.redirect('/admin/categories');
}