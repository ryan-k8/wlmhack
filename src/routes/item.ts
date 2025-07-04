import { Router } from 'express';
import {
  createItem,
  listItems,
  getItem,
  updateItem,
  deleteItem,
} from '@/controllers/item';
import { authMiddleware, withRole, USER_ROLE } from '@/middlewares/auth';

const router = Router();

enum ROUTER_URL {
  BASE = '/',
  BY_ID = '/:id',
}

// Create (protected)
router.post(
  ROUTER_URL.BASE,
  authMiddleware,
  withRole([USER_ROLE.ADMIN, USER_ROLE.PARTNER]),
  createItem,
);

// List all
router.get(ROUTER_URL.BASE, listItems);

// Get by ID
router.get(ROUTER_URL.BY_ID, getItem);

// Update (protected)
router.put(
  ROUTER_URL.BY_ID,
  authMiddleware,
  withRole([USER_ROLE.ADMIN, USER_ROLE.PARTNER]),
  updateItem,
);

// Delete (protected)
router.delete(
  ROUTER_URL.BY_ID,
  authMiddleware,
  withRole([USER_ROLE.ADMIN, USER_ROLE.PARTNER]),
  deleteItem,
);

export default router;
