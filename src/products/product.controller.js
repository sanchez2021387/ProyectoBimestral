import { response, request } from 'express';
import Product from './product.model.js';

export const getProductsOutOfStock = async (req = request, res = response) => {
    const { limite, desde } = req.body;
    const query = { stock: 0 };

    const [total, products] = await Promise.all([
        Product.countDocuments(query),
        Product.find(query)
            .skip(Number(desde))
            .limit(Number(limite))
            .populate({
                path: 'category',
                match: { state: true },
                select: 'nameCategory'
            })
    ]);

    res.status(200).json({
        total,
        products
    })
}

export const getProducts = async (req = request, res = response) => {
    const { limite, desde } = req.body;
    const query = { state: true };

    const [total, products] = await Promise.all([
        Product.countDocuments(query),
        Product.find(query)
            .skip(Number(desde))
            .limit(Number(limite))
            .populate({
                path: 'category',
                match: { state: true },
                select: 'nameCategory'
            })
    ]);

    res.status(200).json({
        total,
        products
    })

}

export const getProductById = async (req, res) => {
    const { id } = req.params;
    const product = await Product.findOne({ _id: id });

    res.status(200).json({
        product
    })
}

export const createProduct = async (req, res) => {
    const { nameProduct, descriptionProduct, price, category, stock } = req.body;
    const product = new Product({ nameProduct, descriptionProduct, price, category, stock });

    await product.save();

    res.status(200).json({
        product
    })
}

export const updateProduct = async (req, res = response) => {
    const { id } = req.params;
    const { _id, ...rest } = req.body;

    await Product.findByIdAndUpdate(id, rest);
    const product = await Product.findOne({ _id: id });

    res.status(200).json({
        msg: 'Product Update',
        product
    })
}

export const deleteProduct = async (req, res = response) => {
    const { id } = req.params;

    const product = await Product.findByIdAndUpdate(id, { state: false });

    const authenticatedProduct = req.product;

    res.status(200).json({
        msg: 'Product deleted',
        product,
        authenticatedProduct
    })
}