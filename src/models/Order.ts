import { Model, DataTypes, Optional, Sequelize } from 'sequelize';

type OrderStatus = 'received' | 'paid' | 'delivered';

// These are all the attributes in the User model
export interface OrderAttributes {
  id: number;
  userId: number;
  status: OrderStatus;
}

// Some attributes are optional in `User.build` and `User.create` calls
export type OrderCreationAttributes = Optional<OrderAttributes, 'id'>;

class Order extends Model<OrderAttributes, OrderCreationAttributes> implements OrderAttributes {
  public id!: number;
  public userId!: number;
  public status!: OrderStatus;

  public static tableName = 'orders';

  // timestamps!
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  //access table name
  public static getTableName = (): string => {
    return this.tableName;
  };

  public static initModel(sequelize: Sequelize) {
    Order.init(
      {
        id: {
          type: DataTypes.INTEGER.UNSIGNED,
          autoIncrement: true,
          primaryKey: true,
        },
        userId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          validate: {
            notEmpty: true,
          },
        },
        status: {
          type: new DataTypes.STRING(128),
          allowNull: false,
          validate: {
            notEmpty: true,
          },
        },
      },
      {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        tableName: Order.getTableName()!,
        sequelize, // passing the `sequelize` instance is required
      },
    );
  }
}

export default Order;
