import { Sequelize } from 'sequelize';

export async function authenticate(sequelize: Sequelize): Promise<void> {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully');
  } catch (err) {
    console.error('Unable to connect to db: ', err);
  }
}
