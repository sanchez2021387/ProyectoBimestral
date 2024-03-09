import Buy from '../buyBiker/buyBiker.model.js';
import User from '../user/user.model.js';
import Shopping from '../shopping/shopping.model.js';
import Product from '../products/product.model.js';
import Invoice from '../invoice/invoice.model.js';

export const createBuy = async (req, res) => {
    const { userId, shoppingId, total } = req.body;

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'El usuario no existe' });
        }

        const shopping = await Shopping.findById(shoppingId);
        if (!shopping) {
            return res.status(404).json({ message: 'El carrito de compras no existe' });
        }

        let calculatedTotal;

        if (!Array.isArray(shopping.items)) {
            throw new Error('El carrito de compras no contiene una lista válida de ítems');
        }

        if (shopping.items.length === 0) {
            throw new Error('El carrito de compras está vacío');
        }

        try {
            const calculatedTotalArray = await Promise.all(shopping.items.map(async (item) => {
                const product = await Product.findById(item.product);
                if (!product) {
                    throw new Error(`El producto con ID ${item.product} no existe`);
                }
                return item.quantity * product.price;
            }));
            if (!Array.isArray(calculatedTotalArray)) {
                throw new Error('El resultado de Promise.all() no es un array');
            }

            calculatedTotal = calculatedTotalArray.reduce((acc, itemTotal) => acc + itemTotal, 0);
        } catch (error) {
            console.error('Error al calcular el total de la compra:', error);
            return res.status(500).json({ message: 'Error al calcular el total de la compra', error: error.message });
        }

        if (calculatedTotal !== total) {
            return res.status(400).json({
                msg: 'El total de la compra no coincide con la suma de los productos en el carrito'
            });
        }

        const buy = new Buy({
            user: userId,
            shopping: shoppingId,
            total: calculatedTotal
        });

        await buy.save();

        // Crear la factura
        const invoice = new Invoice({
            user: userId,
            items: shopping.items,
            total: calculatedTotal
        });
        await invoice.save();

        await Shopping.findByIdAndDelete(shoppingId);

        res.status(201).json({ message: 'Compra creada exitosamente', buy });
    } catch (error) {
        console.error('Error al crear la compra:', error);
        res.status(500).json({ message: 'Error al crear la compra', error: error.message });
    }
};

export const getInvoices = async (req, res) => {
    try {
        const invoices = await Invoice.find()
            .populate({
                path: 'user',
                match: { state: true },
                select: 'userName'
            })
            .populate({
                path: 'items.product',
                select: 'nameProduct'
            })

        res.status(200).json({ invoices });
    } catch (error) {
        console.error('Error al obtener las facturas:', error);
        res.status(500).json({ message: 'Error al obtener las facturas', error: error.message });
    }
};