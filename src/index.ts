import express from 'express';
import { PrismaClient } from '@prisma/client';
import userRouter from './routes/user.js';
import blogRouter from './routes/blog.js';

const app = express();
const prisma = new PrismaClient();

app.use('/signup', userRouter);
app.use('/api/v1/blog', blogRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
