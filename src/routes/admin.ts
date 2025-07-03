import { Router } from 'express';
import { createUser, listUsers, updateUser, deleteUser } from '@/controllers/admin';
import { authMiddleware } from '@/middlewares/auth';
import { withRole, USER_ROLE } from '@/middlewares/auth';

const router = Router();

enum ROUTER_URL {
  USER_BASE = '/user',
  USER_BY_ID = '/user/:id',
}

// All routes protected by admin role
router.post(
  ROUTER_URL.USER_BASE,
  authMiddleware,
  withRole([USER_ROLE.ADMIN]),
  createUser,
);
router.get(ROUTER_URL.USER_BASE, authMiddleware, withRole([USER_ROLE.ADMIN]), listUsers);
router.put(
  ROUTER_URL.USER_BY_ID,
  authMiddleware,
  withRole([USER_ROLE.ADMIN]),
  updateUser,
);
router.delete(
  ROUTER_URL.USER_BY_ID,
  authMiddleware,
  withRole([USER_ROLE.ADMIN]),
  deleteUser,
);

export default router;
