import { Schema, model, Document } from 'mongoose';

// IItemDocument is intentional (prefix interfaces with I)
export interface IItemDocument extends Document {
  name: string;
  description?: string;
  price: number;
  status: 'active' | 'inactive';
  partnerId: { type: String; required: true }; // who owns/sells it
  qty: number; // current stock
  createdAt: Date;
  updatedAt: Date;
}

const itemSchema = new Schema<IItemDocument>(
  {
    name: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    partnerId: { type: String, required: true },
    qty: { type: Number, required: true, default: 0 },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  },
  { timestamps: true },
);

export default model<IItemDocument>('Item', itemSchema);
