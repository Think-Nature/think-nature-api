import { Request, Response } from 'express';
import UserService from '../services/UserService';

export default class UserController {
  private userService: UserService;

  constructor(userService: UserService) {
    this.userService = userService;
  }

  async getAllUsers(res: Response) {
    const users = (await this.userService.getAllUsers()) || [];
    res.json(users);
  }

  async getOneUserById(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const user = (await this.userService.getOneUserById(id))[0];

      res.json(user);
    } catch (e) {
      res.status(400);
      res.json(e);
    }
  }

  async createUser(req: Request, res: Response) {
    try {
      const user = (await this.userService.createUser(req.body))[0];
      res.status(201);
      res.json(user);
    } catch (e) {
      const { message } = e as Error;
      res.status(400);
      res.json({ message: message });
    }
  }

  async updateOneUserById(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);

      // Sequelize returns the number of updates and the list of updated rows
      // We only want 1 updated row (since id is unique), hence the indexing [1][0]
      const user = (await this.userService.updateOneUserById(id, req.body))[1][0];

      res.json(user);
    } catch (e) {
      res.status(400);
      res.json(e);
    }
  }

  async deleteOneUserById(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const numberOfDeletedRows = await this.userService.deleteOneUserById(id);

      res.json(numberOfDeletedRows);
    } catch (e) {
      res.status(400);
      res.json(e);
    }
  }
}
