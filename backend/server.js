import dotenv from 'dotenv';
import connectDB from './src/config/db.js';
import router from './src/routes/AdminRoutes.js';
import express from 'express';
import cors from 'cors';
dotenv.config();



const app = express();
app.use(express.json());
app.use(cors());
app.use('/api/admin', router);


const PORT = process.env.PORT || 3100;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port http://localhost:${PORT}`);
  });
});