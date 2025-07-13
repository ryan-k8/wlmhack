import mongoose, { Schema, Document } from 'mongoose';

import { hashPassword } from '@/utils/jwt';

export interface IUserDocument extends Document {
  name: string;
  email: string;
  password: string;
  role: 'customer' | 'partner' | 'admin';
  location: {
    type: 'Point';
    coordinates: [number, number]; // [longitude, latitude]
  };
  notifications: {
    message: string; // Short notification message
    read: boolean; // Read status
  }[];
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
  notifications: [
    {
      message: { type: String, required: true },
      read: { type: Boolean, default: false },
    },
  ],
});

// Ensure 2dsphere index for geospatial queries
UserSchema.index({ location: '2dsphere' });

UserSchema.pre<IUserDocument>('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await hashPassword(this.password);
  }
  next();
});

export default mongoose.model<IUserDocument>('User', UserSchema);
