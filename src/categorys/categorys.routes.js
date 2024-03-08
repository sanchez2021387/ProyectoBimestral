import { Router } from "express";
import { check } from "express-validator";
import {createCategorys, deleteCategorys, getCategorys, updateCategorys} from './categorys.controller.js'
import { existeCategorys, existeCategorysById } from '../helpers/dv-validators.js'
import { validarCampos } from "../middlewares/validar-campos.js";
import { validarJWT } from "../middlewares/validar-jwt.js";
import { hasRole } from "../middlewares/validar-roles.js";

const router = Router();

router.get("/", getCategorys);

router.post(
    "/",
    [
        validarJWT,
        hasRole('USER_ADMIN'),
        check("nameCategorys", "El nombre es obligatorio").not().isEmpty(),
        check("nameCategorys").custom(existeCategorys),
        validarCampos,
    ],
    createCategorys
);

router.put(
    "/:id",
    [
        validarJWT,
        tieneRole('USER_ADMIN'),
        check('id', 'No es un Id valido').isMongoId(),
        check("id").custom(existeCategorysById),
        validarCampos,
    ],
    updateCategorys
);

router.delete(
    "/:id",
    [
        validarJWT,
        tieneRole('USER_ADMIN'),
        check('id', 'No es un Id valido').isMongoId(),
        check("id").custom(existeCategorysById),
        validarCampos,
    ],
    deleteCategorys
);

export default router;