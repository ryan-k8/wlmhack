import { RequestHandler } from 'express';
import User from '@/models/user';

type CreateUserDto = {
  name: string;
  email: string;
  password: string;
  role: 'customer' | 'partner' | 'admin';
};

type UpdateUserDto = Partial<CreateUserDto>;

// Create new user (admin can set role)
export const createUser: RequestHandler<{}, {}, CreateUserDto> = async (req, res) => {
  const { name, email, password, role } = req.body;
  try {
    const user = new User({ name, email, password, role });
    await user.save();
    res.status(201).json(user);
    return;
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Failed to create user' });
    return;
  }
};

// List all users
export const listUsers: RequestHandler = async (_req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
    return;
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch users' });
    return;
  }
};

// Update user by ID
export const updateUser: RequestHandler<{ id: string }, {}, UpdateUserDto> = async (
  req,
  res,
) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    }).select('-password');
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }
    res.json(user);
    return;
  } catch (err) {
    res.status(500).json({ error: 'Failed to update user' });
    return;
  }
};

// Delete user by ID
export const deleteUser: RequestHandler<{ id: string }, {}, {}> = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }
    res.json({ message: 'User deleted' });
    return;
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete user' });
    return;
  }
};
