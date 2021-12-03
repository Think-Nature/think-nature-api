import { UserAttributes, UserCreationAttributes } from '../models/User';
import UserRepository from '../repositories/UserRepository';

export default class UserService {
  private userRepository: UserRepository;

  constructor(userRepository: UserRepository) {
    this.userRepository = userRepository;
  }

  async getAllUsers() {
    return this.userRepository.getAll();
  }

  async getOneUserById(id: number, showPassword = false) {
    return showPassword
      ? this.userRepository.getScopeWithFilters({ id }, 'withPassword')
      : this.userRepository.getWithFilters({ id });
  }

  async getOneUserByEmail(email: string, showPassword = false) {
    return showPassword
      ? this.userRepository.getScopeWithFilters({ email }, 'withPassword')
      : this.userRepository.getWithFilters({ email });
  }

  async createUser(user: UserCreationAttributes) {
    return this.userRepository.bulkCreate([user]);
  }

  async updateOneUserById(id: number, attrs: UserAttributes) {
    return this.userRepository.updateWithFilters(attrs, { id });
  }

  async deleteOneUserById(id: number) {
    return this.userRepository.deleteWithFilters({ id });
  }
}
