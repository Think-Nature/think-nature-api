import { Model, DataTypes, Optional, Sequelize } from 'sequelize';
import bcrypt from 'bcrypt';
import environment from '../consts/environment';

// These are all the attributes in the User model
export interface UserAttributes {
  id: number;
  email: string;
  password: string;
  isGuest: boolean;
  phoneNumber: string;
}

// Some attributes are optional in `User.build` and `User.create` calls
export type UserCreationAttributes = Optional<UserAttributes, 'id'>;

class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  public id!: number;
  public email!: string;
  public password!: string;
  public isGuest!: boolean;
  public phoneNumber!: string;

  public static tableName = 'users';

  // timestamps!
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  //access table name
  public static getTableName = (): string => {
    return this.tableName;
  };

  public static passwordHasher = async (password: string) => {
    const salt = await bcrypt.genSalt(environment.saltRounds);
    return await bcrypt.hash(password, salt);
  };

  public isPasswordMatch = async (password: string): Promise<boolean> => {
    return bcrypt.compare(password, this.password);
  };

  public static initModel(sequelize: Sequelize) {
    User.init(
      {
        id: {
          type: DataTypes.INTEGER.UNSIGNED,
          autoIncrement: true,
          primaryKey: true,
        },
        email: {
          type: new DataTypes.STRING(128),
          unique: true,
          allowNull: false,
          validate: {
            isEmail: true,
            notEmpty: true,
          },
        },
        password: {
          type: new DataTypes.STRING(128),
          allowNull: true,
        },
        phoneNumber: {
          type: new DataTypes.STRING(128),
          unique: true,
          allowNull: false,
          validate: {
            notEmpty: true,
          },
        },
        isGuest: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          validate: {
            notEmpty: true,
          },
        },
      },
      {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        tableName: User.getTableName()!,
        sequelize, // passing the `sequelize` instance is required
        defaultScope: { attributes: { exclude: ['password'] } },
        scopes: {
          withPassword: {
            attributes: { include: ['password'] },
          },
        },
        hooks: {
          beforeBulkCreate: async (user: User[]) => {
            for (let i = 0; i < user.length; i++) {
              const hashedPassword = await User.passwordHasher(user[i].password);
              user[i].password = hashedPassword;
            }
          },
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          beforeBulkUpdate: async (user: any) => {
            if ('password' in user.attributes) {
              const hashedPassword = await User.passwordHasher(user.attributes.password as string);
              user.attributes.password = hashedPassword;
            }
          },
        },
      },
    );
  }
}

export default User;
