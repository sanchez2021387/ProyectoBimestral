import express from 'express';
import { createBuy, getInvoices } from './invoice.controller.js';
import { validarJWT } from '../middlewares/validar-jwt.js';

const router = express.Router();

// Obtener todas las facturas
router.get('/', validarJWT, getInvoices);
/*
// Obtener una factura por su ID
router.get('/:id', validarJWT, getInvoiceById);
*/
// Crear una nueva factura
router.post('/', validarJWT, createBuy);

export default router;