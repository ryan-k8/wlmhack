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
export const register = async (req: Request, res: Response) => {
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

// Login controller
export const login = async (req: Request, res: Response) => {
  const { email, password }: LoginDto = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: 'Invalid credentials' });

    const isMatch = await comparePassword(password, user.password);

    if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '1d' },
    );

    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: 'Login failed' });
  }
};
