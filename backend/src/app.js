import express from 'express';
import router from './routes/AdminRoutes.js';

const app = express();
app.use(express.json());

// Routes
app.use('/api/admin', router);

export default app;
