import 'express-async-errors';
import serverless from 'serverless-http';
import express from 'express';
import { Server } from '@overnightjs/core';
import { usersController } from './modules/users/user.controller';
import { balancesController } from './modules/balances/balance.controller';
import { handleErrors } from './middlewares/errors.middleware';
import { earningsController } from './modules/earnings/earning.controller';

class Main extends Server {
    constructor() {
        super(process.env.NODE_ENV === 'development');
        this.app.use(express.json());
        this.setupControllers();
        this.app.use(handleErrors);
    }

    private setupControllers() {
        super.addControllers([
            usersController,
            balancesController,
            earningsController,
        ]);
    }
}

const app = new Main().app;

export const handler = serverless(app);

