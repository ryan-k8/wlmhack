import express from 'express';

import authRouter from './auth';
import itemRouter from './item';
import orderRouter from './order';
import returnRouter from './returns';
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
}

router.use(ROUTER_URL.AUTH, authRouter);
router.use(ROUTER_URL.ITEMS, itemRouter);
router.use(ROUTER_URL.ORDERS, orderRouter);
router.use(ROUTER_URL.RETURNS, returnRouter);
router.use(ROUTER_URL.ADMIN, adminRouter);

export default router;
