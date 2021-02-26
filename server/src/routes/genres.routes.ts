import { Router } from 'express';
import { body } from 'express-validator';
import * as authc from './controllers/auth.controllers';
import * as genresc from './controllers/genres.controllers';

const router = Router();

router.get('/', authc.isSignedIn, genresc.getAllGenres);

router.post('/add', authc.isSignedIn, authc.isAdmin, [
    body("name")
        .notEmpty() 

], genresc.addGenre);

export default router;