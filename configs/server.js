'use strict'

import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import { dbConnection } from './mongo.js';
import userRoutes from '../src/user/user.routes.js';
import authRoutes from '../src/auth/auth.routes.js';
import categoryRoutes from '../src/category/category.routes.js';
import productRoutes from '../src/products/product.routes.js';
import shoppingRoutes from '../src/shopping/shopping.routes.js';
import buyShoppingRotues from '../src/buyBiker/buyBiker.routes.js'
import invoiceRoutes from '../src/invoice/invoice.routes.js';

class Server {
    constructor() {
        this.app = express();
        this.port = process.env.PORT;
        this.usuarioPath = '/proyectoBimestral/v1/users'
        this.authPath = '/proyectoBimestral/v1/auth'
        this.categoryPath = '/proyectoBimestral/v1/category'
        this.productPath = '/proyectoBimestral/v1/product'
        this.shoppingPath = '/proyectoBimestral/v1/shopping'
        this.buyShoppingPath = '/proyectoBimestral/v1/buyShopping'
        this.invoicePath = '/proyectoBimestral/v1/invoice'

        this.middlewares();
        this.conectarDB();
        this.routes();
    }
    async conectarDB() {
        await dbConnection();
    }

    middlewares() {
        
        this.app.use(express.urlencoded({ extended: false }));
        this.app.use(cors());
        this.app.use(express.json());
        this.app.use(helmet());
        this.app.use(morgan('dev'));
    }

    routes() {
        this.app.use(this.usuarioPath, userRoutes);
        this.app.use(this.authPath, authRoutes);
        this.app.use(this.categoryPath, categoryRoutes);
        this.app.use(this.productPath, productRoutes);
        this.app.use(this.shoppingPath, shoppingRoutes);
        this.app.use(this.buyShoppingPath, buyShoppingRotues);
        this.app.use(this.invoicePath, invoiceRoutes);
    }

    listen() {
        this.app.listen(this.port, () => {
            console.log('Server running on port ', this.port);
        });
    }
}

export default Server;