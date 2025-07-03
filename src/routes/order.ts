import { Router } from 'express';
import {
  placeOrder,
  listOrders,
  getOrder,
  cancelOrder,
  updateOrder,
  shipOrder,
  deliverOrder,
  markReturnedOrder,
} from '@/controllers/order';
import { authMiddleware } from '@/middlewares/auth';
import { withRole, USER_ROLE } from '@/middlewares/auth';

const router = Router();

enum ROUTER_URL {
  BASE = '/',
  BY_ID = '/:id',
  CANCEL = '/:id/cancel',
  SHIP = '/:id/ship',
  DELIVER = '/:id/deliver',
  RETURNED = '/:id/returned',
}

// Place order (any logged-in user)
router.post(ROUTER_URL.BASE, authMiddleware, placeOrder);

// List own orders
router.get(ROUTER_URL.BASE, authMiddleware, listOrders);

// Get single order by ID
router.get(ROUTER_URL.BY_ID, authMiddleware, getOrder);

// Cancel order
router.put(ROUTER_URL.CANCEL, authMiddleware, cancelOrder);

// Update order
router.put(ROUTER_URL.BY_ID, authMiddleware, updateOrder);

// Ship order (partner/admin)
router.put(
  ROUTER_URL.SHIP,
  authMiddleware,
  withRole([USER_ROLE.ADMIN, USER_ROLE.PARTNER]),
  shipOrder,
);

// Deliver order (partner/admin)
router.put(
  ROUTER_URL.DELIVER,
  authMiddleware,
  withRole([USER_ROLE.ADMIN, USER_ROLE.PARTNER]),
  deliverOrder,
);

// Mark as returned (partner/admin)
router.put(
  ROUTER_URL.RETURNED,
  authMiddleware,
  withRole([USER_ROLE.ADMIN, USER_ROLE.PARTNER]),
  markReturnedOrder,
);

export default router;
