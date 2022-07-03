import { Controller, Get, Middleware, Post } from '@overnightjs/core';
import { Request, Response } from 'express';
import { Balance } from './balance.model';
import { User } from '../users/user.model';
import { InternalError, NotFound } from '../../common/httpErrors';
import { authentication } from '../../middlewares/auth.middleware';
import { validateBody } from '../../middlewares/validation.middleware';
import { CreateBalance } from './balance.schemas';

@Controller('balances')
class BalanceController {
    constructor(
            private balanceModel = new Balance(),
            private userModel = new User()
    ) { }

    @Post()
    @Middleware([authentication, validateBody(CreateBalance)])
    async create(req: Request, res: Response) {
        const { description } = req.body;
        const { userEmail } = req;
        try {
            const user = await this.userModel.getUserByEmail(userEmail);
            if (user) {
                await this.balanceModel.createBalance(description, user.id);
                return res.status(201).json();
            }
            throw new NotFound(`User with e-mail "${userEmail}" not found!`);
        } catch (error) {
            throw new InternalError(error as string);
        }
    }

    @Get()
    @Middleware(authentication)
    async list(req: Request, res: Response) {
        const { userEmail } = req;
        try {
            const user = await this.userModel.getUserByEmail(userEmail);
            if (user) {
                const balances = await this.balanceModel.getBalancesByUserId(user.id);
                return res.json(balances);
            }
            throw new NotFound(`User with e-mail "${userEmail}" not found!`);
        } catch (error) {
            throw new InternalError(error as string);
        }
    }
}

export const balancesController = new BalanceController();
