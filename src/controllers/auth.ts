import { RequestHandler } from 'express';
import jwt from 'jsonwebtoken';
import User from '@/models/user';
import { comparePassword } from '@/utils/jwt';
import { ApiError } from '@/utils/error';

type RegisterDto = {
  name: string;
  email: string;
  password: string;
  role?: 'customer' | 'partner' | 'admin';
};

type LoginDto = {
  email: string;
  password: string;
};

// Register controller
export const register: RequestHandler<{}, {}, RegisterDto> = async (req, res) => {
  const { name, email, password, role }: RegisterDto = req.body;
  const user = new User({ name, email, password, role });
  await user.save();
  res.json({ message: 'User registered successfully' });
};

// Login controller
export const login: RequestHandler<{}, {}, LoginDto> = async (req, res) => {
  const { email, password } = req.body;

  console.log('Login attempt:', { email });
  const user = await User.findOne({ email });
  if (!user) {
    throw new ApiError(400, 'Invalid credentials');
  }

  const isMatch = await comparePassword(password, user.password);
  console.log('Password match:', isMatch);

  if (!isMatch) {
    throw new ApiError(400, 'Invalid credentials');
  }

  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET || 'secret',
    { expiresIn: '1d' },
  );

  res.json({ token });
};
