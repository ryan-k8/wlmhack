import { RequestHandler } from 'express';
import Order from '@/models/order';
import Item from '@/models/item';

type OrderItemDto = {
  itemId: string;
  qty: number;
};

type PlaceOrderDto = {
  items: OrderItemDto[];
};

// Place new order
export const placeOrder: RequestHandler<{}, {}, PlaceOrderDto> = async (req, res) => {
  const userId = req.user?.id;
  const { items } = req.body;

  try {
    const orderItems = [];
    for (const reqItem of items) {
      const itemDoc = await Item.findById(reqItem.itemId);
      if (!itemDoc) {
        res.status(404).json({ error: `Item not found: ${reqItem.itemId}` });
        return;
      }
      if (itemDoc.qty < reqItem.qty) {
        res.status(400).json({ error: `Not enough stock for item: ${itemDoc.name}` });
        return;
      }
      itemDoc.qty -= reqItem.qty;
      await itemDoc.save();
      orderItems.push({
        itemId: itemDoc._id,
        partnerId: itemDoc.partnerId,
        qty: reqItem.qty,
        priceAtPurchase: itemDoc.price,
      });
    }
    const order = new Order({ userId, items: orderItems, status: 'placed' });
    await order.save();
    res.status(201).json(order);
    return;
  } catch (err) {
    res.status(500).json({ error: 'Failed to place order' });
    return;
  }
};

// List all orders of current user
export const listOrders: RequestHandler = async (req, res) => {
  const userId = req.user?.id;
  try {
    const orders = await Order.find({ userId });
    res.json(orders);
    return;
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch orders' });
    return;
  }
};

// Get single order (must belong to user)
export const getOrder: RequestHandler<{ id: string }> = async (req, res) => {
  const userId = req.user?.id;
  try {
    const order = await Order.findOne({ _id: req.params.id, userId });
    if (!order) {
      res.status(404).json({ error: 'Order not found' });
      return;
    }
    res.json(order);
    return;
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch order' });
    return;
  }
};

// Cancel order (only if status is placed)
export const cancelOrder: RequestHandler<{ id: string }> = async (req, res) => {
  const userId = req.user?.id;
  try {
    const order = await Order.findOneAndUpdate(
      { _id: req.params.id, userId, status: 'placed' },
      { status: 'cancelled' },
      { new: true },
    );
    if (!order) {
      res.status(404).json({ error: 'Order not found or cannot be cancelled' });
      return;
    }
    res.json(order);
    return;
  } catch (err) {
    res.status(500).json({ error: 'Failed to cancel order' });
    return;
  }
};

// Update order (only if status is placed)
export const updateOrder: RequestHandler<
  { id: string },
  {},
  Partial<PlaceOrderDto>
> = async (req, res) => {
  const userId = req.user?.id;
  try {
    const order = await Order.findOneAndUpdate(
      { _id: req.params.id, userId, status: 'placed' },
      req.body,
      { new: true },
    );
    if (!order) {
      res.status(404).json({ error: 'Order not found or cannot be updated' });
      return;
    }
    res.json(order);
    return;
  } catch (err) {
    res.status(500).json({ error: 'Failed to update order' });
    return;
  }
};

// Mark order as shipped (partner/admin)
export const shipOrder: RequestHandler<{ id: string }> = async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status: 'shipped' },
      { new: true },
    );
    if (!order) {
      res.status(404).json({ error: 'Order not found' });
      return;
    }
    res.json(order);
    return;
  } catch (err) {
    res.status(500).json({ error: 'Failed to mark order as shipped' });
    return;
  }
};

// Mark order as delivered (partner/admin)
export const deliverOrder: RequestHandler<{ id: string }> = async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status: 'delivered' },
      { new: true },
    );
    if (!order) {
      res.status(404).json({ error: 'Order not found' });
      return;
    }
    res.json(order);
    return;
  } catch (err) {
    res.status(500).json({ error: 'Failed to mark order as delivered' });
    return;
  }
};

// Mark order as returned (partner/admin)
export const markReturnedOrder: RequestHandler<{ id: string }> = async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status: 'returned' },
      { new: true },
    );
    if (!order) {
      res.status(404).json({ error: 'Order not found' });
      return;
    }
    res.json(order);
    return;
  } catch (err) {
    res.status(500).json({ error: 'Failed to mark order as returned' });
    return;
  }
};
