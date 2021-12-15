import { Model, DataTypes, Optional, Sequelize } from 'sequelize';

// These are all the attributes in the User model
export interface OrderDetailAttributes {
  id: number;
  orderId: number;
  productId: number;
  productQuantity: number;
}

// Some attributes are optional in `User.build` and `User.create` calls
export type OrderDetailCreationAttributes = Optional<OrderDetailAttributes, 'id'>;

class OrderDetail extends Model<OrderDetailAttributes, OrderDetailCreationAttributes> implements OrderDetailAttributes {
  public id!: number;
  public orderId!: number;
  public productId!: number;
  public productQuantity!: number;

  public static tableName = 'order_details';

  // timestamps!
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  //access table name
  public static getTableName = (): string => {
    return this.tableName;
  };

  public static initModel(sequelize: Sequelize) {
    OrderDetail.init(
      {
        id: {
          type: DataTypes.INTEGER.UNSIGNED,
          autoIncrement: true,
          primaryKey: true,
        },
        orderId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          validate: {
            notEmpty: true,
          },
        },
        productId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          validate: {
            notEmpty: true,
          },
        },
        productQuantity: {
          type: DataTypes.INTEGER,
          allowNull: false,
          validate: {
            notEmpty: true,
          },
        },
      },
      {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        tableName: OrderDetail.getTableName()!,
        sequelize, // passing the `sequelize` instance is required
      },
    );
  }
}

export default OrderDetail;
