import express from 'express';
import {
  createRunValidation,
  updateRunValidation,
  getRunValidation,
} from '../validations/runs';
import { RunsService } from '../services/runs.service';
import { authMiddleware } from '../middleware/authMiddleware';

const router = express.Router();
const runsService = new RunsService();

router.post(
  '/runs',
  authMiddleware,
  createRunValidation,
  runsService.createRun,
);

router.put(
  '/runs/:id',
  authMiddleware,
  updateRunValidation,
  runsService.updateRun,
);

router.get('/runs', runsService.getAllRuns);
router.get('/runs/:id', getRunValidation, runsService.getRun);

router.delete(
  '/runs/:id',
  authMiddleware,
  getRunValidation,
  runsService.deleteRun,
);

export default router;
