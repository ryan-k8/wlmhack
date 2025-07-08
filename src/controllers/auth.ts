import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';

import User from '@/models/user';
import { comparePassword } from '@/utils/jwt';

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

  try {
    const user = new User({ name, email, password: password, role });
    await user.save();
    res.json({ message: 'User registered successfully' });
  } catch (err) {
    console.log(err);

    res.status(500).json({ error: 'Registration failed' });
  }
};

import { RequestHandler } from 'express';

export const login: RequestHandler<{}, {}, LoginDto> = async (req, res) => {
  const { email, password } = req.body;

  try {
    console.log('Login attempt:', { email });
    const user = await User.findOne({ email });
    if (!user) {
      res.status(400).json({ error: 'Invalid credentials' });
      return;
    }

    const isMatch = await comparePassword(password, user.password);
    console.log('Password match:', isMatch);

    if (!isMatch) {
      res.status(400).json({ error: 'Invalid credentials' });
      return;
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '1d' },
    );

    res.json({ token });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Login failed' });
    return;
  }
};
