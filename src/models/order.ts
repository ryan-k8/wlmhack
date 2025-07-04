import { Schema, model, Document } from 'mongoose';

export interface OrderDocument extends Document {
  userId: string; // reference to User._id
  items: {
    itemId: string; // reference to Item._id
    qty: number;
    priceAtPurchase: number;
  }[];
  status: 'placed' | 'completed' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
}

const orderSchema = new Schema<OrderDocument>(
  {
    userId: { type: String, required: true },
    items: [
      {
        itemId: String,
        partnerId: String, // who sold this item
        qty: Number,
        priceAtPurchase: Number,
      },
    ],
    status: {
      type: String,
      enum: ['placed', 'shipped', 'delivered', 'returned', 'cancelled'],
      default: 'placed',
    },
  },
  { timestamps: true },
);

export default model<OrderDocument>('Order', orderSchema);
