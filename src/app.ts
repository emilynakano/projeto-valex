import express, {json} from 'express';
import 'express-async-errors';
import cors from 'cors';
import dotenv from 'dotenv';
import router from './routes/index'
import errorHandlingMiddleware from './middlewares/errorHandlingMiddleware'

dotenv.config();

const app = express();

app.use(cors());
app.use(json());
app.use(router);

app.use(errorHandlingMiddleware)

app.listen(process.env.PORT)