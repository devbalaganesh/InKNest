import express from 'express';
import { PrismaClient } from '@prisma/client';
import { Request, Response, NextFunction } from "express";
import jwt from 'jsonwebtoken';

const blogRouter = express.Router();
const prisma = new PrismaClient();

const JWT_SECRET = process.env.JWT_SECRET || "supersecret";

// Middleware to protect routes
const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1]; // Bearer <token>
  if (!token) return res.status(401).json({ message: "No token provided" });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: "Invalid token" });
    // @ts-ignore
    req.user = user; // store decoded user info in request
    next();
  });
};

// Apply authentication middleware to all routes except GET (public ones)
blogRouter.use('/api/v1/blog', (req, res, next) => {
  // Allow unauthenticated GET requests
  if (req.method === 'GET') return next();
  authenticateToken(req, res, next);
});

// Create blog
blogRouter.post('/api/v1/blog', async (req, res) => {
  const body = req.body;
  try {
    // @ts-ignore
    const authorID = req.user?.id;
    if (!authorID) return res.status(400).json({ message: "User ID missing from token" });

    const blog = await prisma.post.create({
      data: {
        title: body.title,
        content: body.content,
        authorID:(authorID), // from token
      },
    });
    res.json(blog);
  } catch (e) {
    res.status(500).json({ message: "Unable to create blog" });
  }
});

// Update blog
blogRouter.put('/api/v1/blog', async (req, res) => {
  const body = req.body;
  try {
    const blog = await prisma.post.update({
      where: { id: (body.id) },
      data: { title: body.title, content: body.content },
    });
    res.json(blog);
  } catch (e) {
    res.status(500).json({ message: "Unable to update blog" });
  }
});

// Get single blog (public route)
blogRouter.get('/api/v1/blog/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const blog = await prisma.post.findUnique({ where: { id: id } });
    if (!blog) return res.status(404).json({ message: "Blog not found" });
    res.json(blog);
  } catch (e) {
    res.status(500).json({ message: "Unable to get blog" });
  }
});

// Get all blogs (public route)
blogRouter.get('/api/v1/blog/bulk', async (req, res) => {
  try {
    const blogs = await prisma.post.findMany();
    res.json(blogs);
  } catch (e) {
    res.status(500).json({ message: "Unable to get blogs" });
  }
});

export default blogRouter;
