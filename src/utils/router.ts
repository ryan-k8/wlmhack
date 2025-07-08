import express from 'express';
import { RequestHandler } from 'express';

export const wrapRouter = (
  router: express.Router,
  wrapper: (fn: RequestHandler) => RequestHandler,
) => {
  router.stack.forEach((layer: any) => {
    if (layer.route) {
      const routeStack = layer.route.stack;
      routeStack.forEach((routeLayer: any, i: number) => {
        if (typeof routeLayer.handle === 'function') {
          routeLayer.handle = wrapper(routeLayer.handle);
        }
      });
    }
  });
  return router;
};
