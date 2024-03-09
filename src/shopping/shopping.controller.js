import Shopping from './shopping.model.js';
import User from '../user/user.model.js';
import Product from '../products/product.model.js';

export const createShopping = async (req, res) => {
    try {
        const { userId, productId, quantity } = req.body;
        const { userId: authenticatedUserId } = req.user;


        if (authenticatedUserId !== userId) {
            return res.status(401).json({
                message: 'Unauthorized access to create shopping cart for another user'
            });
        }

        const user = await User.findById(userId);
        const product = await Product.findById(productId);

        if (!user || !product) {
            return res.status(404).json({
                message: 'User or product not found'
            });
        }

        if (product.stock < quantity) {
            return res.status(400).json({
                message: 'Insufficient stock for the product'
            });
        }

        let shopping = await Shopping.findOne({ user: userId });

        if (!shopping) {
            shopping = new Shopping({ user: userId, items: [] });
        }

        const existingItemIndex = shopping.items.findIndex(item => item.product.toString() === productId);

        if (existingItemIndex !== -1) {
            shopping.items[existingItemIndex].quantity += parseInt(quantity);
        } else {
            shopping.items.push({
                product: productId,
                quantity,
                price: product.price
            });
        }

        shopping.totalPrice = shopping.items.reduce((total, item) => {
            return total + (item.price * item.quantity);
        }, 0);

        product.stock -= quantity;

        await Promise.all([
            product.save(),
            shopping.save()
        ]);

        res.status(201).json({
            message: 'Product added to shopping successfully',
            shopping
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Error adding product to shopping',
            error: error.message
        });
    }
};


export const getShopping = async (req, res) => {
    try {
        const { userId } = req.params;

        // Buscar el carrito de compras del usuario
        const shopping = await Shopping.findOne({ user: userId })
            .populate({
                path: 'items.product',
                select: 'name price'
            });

        res.status(200).json({
            message: 'Shopping retrieved successfully',
            shopping
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Error retrieving shopping cart',
            error: error.message
        });
    }
};

export const getShoppingBiker = async (req = request, res = response) => {
    const { limite, desde } = req.body;
    const query = { state: true }

    const [total, shopping] = await Promise.all([
        Shopping.countDocuments(query),
        Shopping.find(query)
            .skip(Number(desde))
            .limit(Number(limite))
    ]);

    res.status(200).json({
        total,
        shopping
    })

}