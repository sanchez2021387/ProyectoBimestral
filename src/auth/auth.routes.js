import { Router } from "express";
import { check } from "express-validator";
import { validarCampos } from "../middlewares/validar-campos.js"
import { login } from "./auth.controller.js"

const router = Router();

router.post(
    
    '/login',
    [
        check('emailOrUser', 'This is not a valid email').not().isEmpty(),
        check('password', 'The password is required').not().isEmpty(),
        validarCampos
    ],
    login
)

export default router;