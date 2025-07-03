import { Request, Response } from 'express';
import Order from '@/models/order';

// Place new order
export const placeOrder = async (req: Request, res: Response) => {
  const userId = req.user?.id;
  const { items } = req.body;
  try {
    const order = new Order({ userId, items, status: 'placed' });
    await order.save();
    res.status(201).json(order);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Failed to place order' });
  }
};

// List all orders of current user
export const listOrders = async (req: Request, res: Response) => {
  const userId = req.user?.id;
  try {
    const orders = await Order.find({ userId });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
};

// Get single order (must belong to user)
export const getOrder = async (req: Request, res: Response) => {
  const userId = req.user?.id;
  try {
    const order = await Order.findOne({ _id: req.params.id, userId });
    if (!order) return res.status(404).json({ error: 'Order not found' });
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch order' });
  }
};

// Cancel order (only if status is placed)
export const cancelOrder = async (req: Request, res: Response) => {
  const userId = req.user?.id;
  try {
    const order = await Order.findOneAndUpdate(
      { _id: req.params.id, userId, status: 'placed' },
      { status: 'cancelled' },
      { new: true },
    );
    if (!order)
      return res.status(404).json({ error: 'Order not found or cannot be cancelled' });
    res.json(order);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Failed to cancel order' });
  }
};

// Update order (only if status is placed)
export const updateOrder = async (req: Request, res: Response) => {
  const userId = req.user?.id;
  try {
    const order = await Order.findOneAndUpdate(
      { _id: req.params.id, userId, status: 'placed' },
      req.body,
      { new: true },
    );
    if (!order)
      return res.status(404).json({ error: 'Order not found or cannot be updated' });
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update order' });
  }
};

// Mark order as shipped (partner/admin)
export const shipOrder = async (req: Request, res: Response) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status: 'shipped' },
      { new: true },
    );
    if (!order) return res.status(404).json({ error: 'Order not found' });
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: 'Failed to mark order as shipped' });
  }
};

// Mark order as delivered (partner/admin)
export const deliverOrder = async (req: Request, res: Response) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status: 'delivered' },
      { new: true },
    );
    if (!order) return res.status(404).json({ error: 'Order not found' });
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: 'Failed to mark order as delivered' });
  }
};

// Mark order as returned (partner/admin)
export const markReturnedOrder = async (req: Request, res: Response) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status: 'returned' },
      { new: true },
    );
    if (!order) return res.status(404).json({ error: 'Order not found' });
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: 'Failed to mark order as returned' });
  }
};
