import { response, request } from "express";
import Category from './category.model.js';

export const getCategory = async (req = request, res = response) => {
    const { limite, desde } = req.body;
    const query = { state: true };

    const [total, categorys] = await Promise.all([
        Category.countDocuments(query),
        Category.find(query)
            .skip(Number(desde))
            .limit(Number(limite))
    ]);

    res.status(200).json({
        total,
        categorys
    })
}

export const createCategory = async (req, res) => {
    const { nameCategory } = req.body;
    const category = new Category({ nameCategory });

    await category.save();

    res.status(200).json({
        category
    })
}

export const updateCategory = async (req, res = response) => {

    const { id } = req.params;
    const { _id, ...rest } = req.body;

    await Category.findByIdAndUpdate(id, rest);
    const category = await Category.findOne({ _id: id });

    res.status(200).json({
        msg: 'Category Update',
        category,
    })
}

export const deleteCategory = async (req, res) => {
    const { id } = req.params;

    const category = await Category.findByIdAndUpdate(id, { state: false });

    const authenticatedCategory = req.category;

    res.status(200).json({
        msg: 'Category deleted',
        category,
        authenticatedCategory
    })
}