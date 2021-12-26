import { Router } from 'express';

import { validatorCreate } from '../../middleware/validation/orders';
import { create } from '../../services/orders';

const router = Router();

router.post('/', [validatorCreate], create);

export default router;
