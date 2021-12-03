import { Sequelize } from 'sequelize';

require('dotenv').config();

const { DB_USERNAME, DB_PASSWORD, DB_NAME, DB_HOST } = process.env;

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const sequelize: Sequelize = new Sequelize(DB_NAME!, DB_USERNAME!, DB_PASSWORD, {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  host: DB_HOST!,
  dialect: 'postgres',
});

export default sequelize;
