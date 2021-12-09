import { Model, DataTypes, Optional, Sequelize } from 'sequelize';

// These are all the attributes in the User model
export interface ProductAttributes {
  id: number;
  name: string;
  description?: string;
  quantity: number;
  price: number;
  cost: number;
}

// Some attributes are optional in `User.build` and `User.create` calls
export type ProductCreationAttributes = Optional<ProductAttributes, 'id'>;

class Product extends Model<ProductAttributes, ProductCreationAttributes> implements ProductAttributes {
  public id!: number;
  public name!: string;
  public description?: string;
  public quantity!: number;
  public price!: number;
  public cost!: number;

  public static tableName = 'products';

  // timestamps!
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  //access table name
  public static getTableName = (): string => {
    return this.tableName;
  };

  public static initModel(sequelize: Sequelize) {
    Product.init(
      {
        id: {
          type: DataTypes.INTEGER.UNSIGNED,
          autoIncrement: true,
          primaryKey: true,
        },
        name: {
          type: DataTypes.STRING(128),
          allowNull: false,
          unique: true,
          validate: {
            notEmpty: true,
          },
        },
        description: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
        quantity: {
          type: DataTypes.INTEGER,
          allowNull: false,
          validate: {
            notEmpty: true,
          },
        },
        price: {
          type: DataTypes.DECIMAL(10, 2),
          allowNull: false,
          validate: {
            notEmpty: true,
          },
        },
        cost: {
          type: DataTypes.DECIMAL(10, 2),
          allowNull: false,
          validate: {
            notEmpty: true,
          },
        },
      },
      {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        tableName: Product.getTableName()!,
        sequelize, // passing the `sequelize` instance is required
        defaultScope: { attributes: { exclude: ['cost'] } },
        scopes: {
          withCost: {
            attributes: { include: ['cost'] },
          },
        },
      },
    );
  }
}

export default Product;
