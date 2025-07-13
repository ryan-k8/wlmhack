import { Schema, model, Document } from 'mongoose';

export interface IReturnedItemDocument extends Document {
  returnRequestId: string; // Reference to the ReturnRequest
  approvedResalePrice: number; // Suggested resale price
  status: 'available' | 'claimed'; // Whether still available or claimed
  claimedBy?: string; // Partner/user who claimed it
  location: {
    type: 'Point';
    coordinates: [number, number];
  };
  createdAt: Date;
  updatedAt: Date;
}

const returnedItemSchema = new Schema<IReturnedItemDocument>(
  {
    returnRequestId: { type: String, required: true },
    approvedResalePrice: { type: Number, required: true },
    status: { type: String, enum: ['available', 'claimed'], default: 'available' },
    claimedBy: { type: String },
    location: {
      type: { type: String, enum: ['Point'], default: 'Point' },
      coordinates: { type: [Number], default: [0, 0] },
    },
  },
  { timestamps: true },
);

export default model<IReturnedItemDocument>('ReturnedItem', returnedItemSchema);
