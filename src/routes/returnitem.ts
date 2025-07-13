import { Router } from 'express';
import {
  listAvailableReturnedItems,
  listClaimedReturnedItems,
  getReturnedItem,
  claimReturnedItem,
} from '@/controllers/returnItem';
import { authMiddleware, withRole, USER_ROLE } from '@/middlewares/auth';

const router = Router();

enum ROUTER_URL {
  AVAILABLE = '/available',
  CLAIMED = '/claimed',
  BY_ID = '/:id',
  CLAIM = '/:id/claim',
}

// List available returned items (partners/admin)
router.get(
  ROUTER_URL.AVAILABLE,
  authMiddleware,
  withRole([USER_ROLE.PARTNER, USER_ROLE.ADMIN]),
  listAvailableReturnedItems,
);

// List claimed returned items (customers can buy these)
router.get(ROUTER_URL.CLAIMED, listClaimedReturnedItems);

// Get single returned item (partners/admin)
router.get(
  ROUTER_URL.BY_ID,
  authMiddleware,
  withRole([USER_ROLE.PARTNER, USER_ROLE.ADMIN]),
  getReturnedItem,
);

// Claim a returned item (partners/admin)
router.put(
  ROUTER_URL.CLAIM,
  authMiddleware,
  withRole([USER_ROLE.PARTNER, USER_ROLE.ADMIN]),
  claimReturnedItem,
);

export default router;
