import { response, request } from "express";
import Categorys from '../categorys/categorys.model'
export const getCategorys = async (req = request, res = response) => {
    const { limit, since } = req.body;
    const query = { state: true };

    const [total, categorys] = await Promise.all([
        Categorys.countDocuments(query),
        Categorys.find(query)
            .skip(Number(since))
            .limit(Number(limit))
    ]);

    res.status(200).json({
        total,
        categorys
    })
}

export const createCategorys = async (req, res) => {
    const { nameCategorys } = req.body;
    const categorys = new Categorys({ nameCategorys });

    await categorys.save();

    res.status(200).json({
        categorys
    })
}

export const updateCategorys = async (req, res = response) => {

    const { id } = req.params;
    const { _id, ...rest } = req.body;

    await Categorys.findByIdAndUpdate(id, rest);
    const categorys = await Categorys.findOne({ _id: id });

    res.status(200).json({
        msg: 'Category Update',
        categorys,
    })
}

export const deleteCategorys = async (req, res) => {
    const { id } = req.params;
    const { defaultCategorysId } = req.body;

    try {
        const categorysToDelete = await Categorys.findById(id);

        if (!categorysToDelete) {
            return res.status(404).json({
                msg: 'The category does not exist'
            })
        }

        const productsToUpdate = await Product.find({ categorys: id });

        await Promise.all(productsToUpdate.map(async product => {
            product.categorys = defaultCategorysId;
            await product.save();
        }));

        const categorys = await Categorys.findByIdAndUpdate(id, { state: false });

        res.status(200).json({
            msg: 'Category is eliminated',
            categorys
        })

    } catch (error) {
        res.status(500).json({
            msg: 'Error the eliminated category'
        })
    }
}