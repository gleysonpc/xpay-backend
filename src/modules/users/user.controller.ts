import { Controller, Get, Middleware, Post } from '@overnightjs/core';
import { Request, Response } from 'express';

import { authentication } from '@middlewares/auth.middleware';
import { User } from './user.model';
import { validateBody } from '@middlewares/validation.middleware';
import { SignUpSchema, LoginUpSchema } from './user.schemas';
import jwt from 'jsonwebtoken';
import { NotFound, Unauthorized } from '@common/httpErrors';

@Controller('users')
class UsersController {
    constructor(private userModel = new User()){}

  @Post('signup')
  @Middleware(validateBody(SignUpSchema))
    async signUp(req: Request, res: Response) {
        const { name, email, password } = req.body;
        const user = await this.userModel.signUp(name, email, password);
        if (user) {
            res.status(201).json();
        }
    }

  @Post('login')
  @Middleware(validateBody(LoginUpSchema))
  async login(req: Request, res: Response) {
      const { email, password } = req.body;

      const user = await this.userModel.validateAndUserPassword(email, password);
      if (!user) {
          throw new Unauthorized('Incorrect "User" or "Password"');
      }
      const accessToken = jwt.sign({ email: user }, process.env.SESSION_SECRET as string);
      return res.json({accessToken});
  }

  @Get()
  @Middleware([authentication])
  async list(_req: Request, res: Response) {
      const users = await this.userModel.getUsers();
      return res.json(users);
  }

  @Get(':userId')
  async show(req: Request, res: Response){
      const { userId } = req.params;
      const user = await this.userModel.getUserById(userId);
      if (!user) {
          throw new NotFound(`Cannot find user with ID: ${userId}`);
      }
      return res.json(user);
  }
}

export const usersController = new UsersController();
