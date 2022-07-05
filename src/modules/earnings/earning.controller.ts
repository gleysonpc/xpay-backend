import { Controller, Get, Post } from '@overnightjs/core';
import { Request, Response } from 'express';
import { Earning } from './earning.model';

@Controller('balances')
class EarningController {
    constructor(private earningModel = new Earning()) {}

    @Post(':balanceId/earnings')
    async create(req: Request, res: Response) {
        const { description, amount } = req.body;
        const { balanceId } = req.params;
        await this.earningModel.createEarning(description, balanceId, amount);
        return res.status(201).json();
    }

    @Get(':balanceId/earnings')
    async list(req: Request, res: Response) {
        const { balanceId } = req.params;
        const earnings = await this.earningModel.getEarningsByBalanceId(balanceId);
        return res.json(earnings);
    }
}

export const earningsController = new EarningController();
