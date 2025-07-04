import { Request, Response } from 'express';
import User from '@/models/user';

// Create new user (admin can set role)
export const createUser = async (req: Request, res: Response) => {
  const { name, email, password, role } = req.body;
  try {
    const user = new User({ name, email, password: password, role });
    await user.save();
    res.status(201).json(user);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Failed to create user' });
  }
};

// List all users
export const listUsers = async (_req: Request, res: Response) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
};

// Update user by ID
export const updateUser = async (req: Request, res: Response) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    }).select('-password');
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update user' });
  }
};

// Delete user by ID
export const deleteUser = async (req: Request, res: Response) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete user' });
  }
};
