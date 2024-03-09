import { Router } from 'express';
import { createShopping, getShopping, getShoppingBiker } from './shopping.controller.js';
import { validarJWT } from '../middlewares/validar-jwt.js';

const router = Router();

router.get("/", getShoppingBiker)

router.get('/:userId',
    validarJWT,
    getShopping);


router.post('/',
    validarJWT,
    createShopping);


export default router;