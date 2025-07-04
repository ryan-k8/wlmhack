import mongoose, { Schema, Document } from 'mongoose';

import { hashPassword } from '@/utils/jwt';

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: 'customer' | 'partner' | 'admin';
  location: {
    type: 'Point';
    coordinates: [number, number]; // [longitude, latitude]
  };
}

const UserSchema: Schema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['customer', 'partner', 'admin'], default: 'customer' },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point',
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      default: [0, 0],
    },
  },
});

UserSchema.pre<IUser>('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await hashPassword(this.password);
  }
  next();
});

export default mongoose.model<IUser>('User', UserSchema);
