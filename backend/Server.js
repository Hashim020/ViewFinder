import Express from "express";
import dotenv from "dotenv";
import cors from "cors"; 
import cookieParser from "cookie-parser";



import { notFound, errorHandler } from "./middleware/errorMiddleware.js";
import connectDB from "./config/db.js";
import userRoutes from './routes/userRoute.js'
import adminRoutes from'./routes/adminRoute.js'

const port = process.env.PORT || 5000;

dotenv.config();
connectDB();
const app = Express();

app.use(Express.json());
app.use(Express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(cors());

app.use('/api/user', userRoutes);
app.use('/api/admin',adminRoutes)

app.get('/', (req, res) => res.send("Server is Ready"));

app.use(notFound);
app.use(errorHandler);

app.listen(port, () => console.log(`Server Is Running http://localhost:${port}`));
