import { Router } from 'express';
import * as authc from '../controllers/auth.controllers';
import * as adminc from '../controllers/admin.controllers';

const router = Router();

router.route('/post/:id').post(
    authc.isSignedIn,
    authc.isAdmin,
    adminc.deleteTopicOrPost
);

router.route('/book/:id').post(
    authc.isSignedIn,
    authc.isAdmin,
    adminc.deleteBook
);

export default router;