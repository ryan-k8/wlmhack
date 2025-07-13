import { Schema, model, Document } from 'mongoose';

export interface IOrderDocument extends Document {
  userId: string; // reference to User._id
  items: {
    itemId: string; // reference to Item._id
    qty: number;
    priceAtPurchase: number;
    isReturnedItem?: boolean; // true if this was bought from returned stock
  }[];
  status: 'placed' | 'completed' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
}

const orderSchema = new Schema<IOrderDocument>(
  {
    userId: { type: String, required: true },
    items: [
      {
        itemId: String,
        partnerId: String, // who sold this item
        qty: Number,
        isReturnedItem: { type: Boolean, default: false }, // optional
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

export default model<IOrderDocument>('Order', orderSchema);
