import { Schema, model, Document } from 'mongoose';

export interface IReturnRequestDocument extends Document {
  userId: string; // Who requested the return
  orderId: string; // Which order
  partnerId: { type: String; required: true }; // Who sold the item
  itemId: string; // Which item in the order
  reason?: string;
  condition: 'new' | 'used' | 'damaged';
  status: 'pending' | 'approved' | 'rejected';
  refundAmount?: number;
  createdAt: Date;
  updatedAt: Date;
}

const returnRequestSchema = new Schema<IReturnRequestDocument>(
  {
    userId: { type: String, required: true },
    orderId: { type: String, required: true },
    partnerId: { type: String, required: true },
    itemId: { type: String, required: true },
    reason: { type: String },
    condition: { type: String, enum: ['new', 'used', 'damaged'], required: true },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
    refundAmount: { type: Number },
  },
  { timestamps: true },
);

export default model<IReturnRequestDocument>('ReturnRequest', returnRequestSchema);
