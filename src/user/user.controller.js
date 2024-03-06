import { response, request } from "express";
import bcryptjs from 'bcryptjs';
import User from './user.model.js';
import { hasRole } from "../middlewares/validar-roles.js";

export const getUsers = async (req = request, res = response) => {
    const { limite, desde } = req.body;
    const query = { state: true }

    const [total, users] = await Promise.all([
        User.countDocuments(query),
        User.find(query)
            .skip(Number(desde))
            .limit(Number(limite))
    ]);

    res.status(200).json({
        total,
        users
    })

}

export const createUser = async (req, res) => {
    const { firstName, lastName, userName, email, password, role } = req.body;
    const user = new User({ firstName, lastName, userName, email, password, role });

    const salt = bcryptjs.genSaltSync();
    user.password = bcryptjs.hashSync(password, salt);

    await user.save();

    res.status(200).json({
        user
    })
}

export const updateUser = async (req, res = response) => {

    const { id } = req.params;
    const { role, ...rest } = req.body;
    const authenticatedUser = req.user;

    try {
        if (authenticatedUser.role === 'USER_ADMIN') { 
            await User.findByIdAndUpdate(id, rest);

            if (role) {
                await User.findByIdAndUpdate(id, { role });
            }

            const user = await User.findOne({ _id: id });

            return res.status(200).json({
                msg: 'User Update',
                user,
            });
        }

        if (authenticatedUser.role === 'USER_CLIENT') {
            if (id !== authenticatedUser.id) {
                return res.status(403).json({
                    msg: 'You do not have permissions to edit other users profiles'
                });
            }
            const allowedFields = ['firstName', 'lastName', 'userName'];
            const fieldsToUpdate = Object.keys(rest).filter(field => allowedFields.includes(field));
            const updateData = {};
            fieldsToUpdate.forEach(field => updateData[field] = rest[field]);

            await User.findByIdAndUpdate(id, updateData);

            const user = await User.findOne({ _id: id });
            res.status(200).json({
                msg: 'Usuario Update',
                user,
            });

        }


    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'An error occurred while updating the user' });

    }
}

export const deleteUser = async (req, res) => {

    const { id } = req.params;

    const authenticatedUser = req.user;

    try {

        if (authenticatedUser.role === 'USER_ADMIN') {
            const user = await User.findByIdAndUpdate(id, { state: false });
            return res.status(200).json({
                msg: 'User eliminated',
                user,
                authenticatedUser
            })
        }


        if (authenticatedUser.role === 'USER_CLIENT') {
            if (id !== authenticatedUser.id) {
                return res.status(403).json({
                    msg: 'You do not have permissions to delete other users profiles '
                })
            }

            const user = await User.findByIdAndUpdate(id, { state: false });
            return res.status(200).json({
                msg: 'User deleted',
                user,
                authenticatedUser
            })
        }

        return res.status(403).json({
            msg: `You need Rol : ${role}`
        })

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            msg: 'error occurred while deleting the user'
        })
    }
}