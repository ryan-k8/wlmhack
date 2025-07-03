import { Router } from 'express';
import {
  createReturn,
  listReturns,
  listPendingReturns,
  approveReturn,
  rejectReturn,
} from '@/controllers/returns';

import { authMiddleware } from '@/middlewares/auth';
import { withRole, USER_ROLE } from '@/middlewares/auth';

const router = Router();

enum ROUTER_URL {
  BASE = '/',
  PENDING = '/pending',
  APPROVE = '/:id/approve',
  REJECT = '/:id/reject',
}

// Create return request (customer)
router.post(
  ROUTER_URL.BASE,
  authMiddleware,
  withRole([USER_ROLE.USER, USER_ROLE.ADMIN]),
  createReturn,
);

// List own return requests (customer)
router.get(ROUTER_URL.BASE, authMiddleware, withRole([USER_ROLE.USER]), listReturns);

// List pending returns (partner/admin)
router.get(
  ROUTER_URL.PENDING,
  authMiddleware,
  withRole([USER_ROLE.ADMIN, USER_ROLE.PARTNER]),
  listPendingReturns,
);

// Approve return (partner/admin)
router.put(
  ROUTER_URL.APPROVE,
  authMiddleware,
  withRole([USER_ROLE.ADMIN, USER_ROLE.PARTNER]),
  approveReturn,
);

// Reject return (partner/admin)
router.put(
  ROUTER_URL.REJECT,
  authMiddleware,
  withRole([USER_ROLE.ADMIN, USER_ROLE.PARTNER]),
  rejectReturn,
);

export default router;
