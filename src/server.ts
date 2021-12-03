import * as dotenv from 'dotenv';

import { authenticate } from './utils/dbUtils';
import sequelize from './db';
import App from './app';

dotenv.config({ path: __dirname + '/.env' });

authenticate(sequelize);

const { SVR_PORT } = process.env;
const app = new App();

app.initMiddlewares();
app.initContainer();
app.initModels();
app.initControllers();
app.listen(SVR_PORT || '8080');
