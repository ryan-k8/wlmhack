import express from 'express';

import authRouter from './auth';
import itemRouter from './item';
import orderRouter from './order';
import returnRouter from './returns';
import returnItemRouter from './returnitem';
import adminRouter from './admin';

const router = express.Router();

// Mount under common prefixes
//router.use('/api', require('./api'));

enum ROUTER_URL {
  AUTH = '/auth',
  ITEMS = '/items',
  ORDERS = '/orders',
  RETURNS = '/returns',
  ADMIN = '/admin',
  RETURNITEMS = '/return-items',
}

router.use(ROUTER_URL.AUTH, authRouter);
router.use(ROUTER_URL.ITEMS, itemRouter);
router.use(ROUTER_URL.ORDERS, orderRouter);
router.use(ROUTER_URL.RETURNS, returnRouter);
router.use(ROUTER_URL.ADMIN, adminRouter);
router.use(ROUTER_URL.RETURNITEMS, returnItemRouter);

export default router;
