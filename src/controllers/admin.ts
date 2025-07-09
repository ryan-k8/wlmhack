import { RequestHandler } from 'express';
import User from '@/models/user';
import { ApiError } from '@/utils/error';

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
  const user = new User({ name, email, password, role });
  await user.save();
  res.status(201).json(user);
};

// List all users
export const listUsers: RequestHandler = async (_req, res) => {
  const users = await User.find().select('-password');
  res.json(users);
};

// Update user by ID
export const updateUser: RequestHandler<{ id: string }, {}, UpdateUserDto> = async (
  req,
  res,
) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  }).select('-password');
  if (!user) throw new ApiError(404, 'User not found');
  res.json(user);
};

// Delete user by ID
export const deleteUser: RequestHandler<{ id: string }, {}, {}> = async (req, res) => {
  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) throw new ApiError(404, 'User not found');
  res.json({ message: 'User deleted' });
};
