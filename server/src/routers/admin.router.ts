import { Router } from 'express';
import * as authc from '../controllers/auth.controllers';
import * as adminc from '../controllers/admin.controllers';

const router = Router();

router.route('/post/:id').post(
    authc.isSignedIn,
    authc.isAdmin,
    adminc.deleteTopicOrPost
);

export default router;