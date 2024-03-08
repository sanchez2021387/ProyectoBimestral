import Role from '../role/role.model.js';
import User from '../user/user.model.js';
import categorys from '../categorys/categorys.model.js';

export const esRoleValido = async (role = '') => {

    if (!role) return true;
    
    const existeRol = await Role.findOne({ role });

    if (!existeRol) {
        throw new Error(`Role ${role} does not exist in the database`);
    }
}

export const existenteEmail = async (email = '') => {
    const existeEmail = await User.findOne({ email });

    if (existeEmail) {
        throw new Error(`The email ${email} has already been registered`);
    }
}

export const existeUsuarioById = async (id = '') => {
    const existeUsuario = await User.findById(id);

    if (!existeUsuario) {
        throw new Error(`El ID: ${id} No existe`);
    }
}
export const existeCategorys = async (nameCategorys = '') => {
    const existeCategorys = await categorys.findOne({ nameCategorys });

    if (existeCategorys) {
        throw new Error(`The category ${nameCategorys} has already been registered`)
    }
}

export const existeCategorysById = async (id = '') => {
    const existeCategorys = await categorys.findById(id);

    if (!existeCategorys) {
        throw new Error(`El ID: ${id} No existe`);
    }
}