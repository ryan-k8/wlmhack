import { Schema, model, Document } from 'mongoose';

export interface ItemDocument extends Document {
  name: string;
  description?: string;
  price: number;
  qty: number; // available stock
  status: 'active' | 'inactive';
  createdAt: Date;
  updatedAt: Date;
}

const itemSchema = new Schema<ItemDocument>(
  {
    name: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    qty: { type: Number, required: true, default: 0 },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  },
  { timestamps: true },
);

export default model<ItemDocument>('Item', itemSchema);
