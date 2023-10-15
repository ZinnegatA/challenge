import express from 'express';
import {
  createRunValidation,
  updateRunValidation,
  getRunValidation,
  deleteRunValidation,
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

router.put('/runs', authMiddleware, updateRunValidation, runsService.updateRun);

router.get('/runs', runsService.getAllRuns);
router.get('/run', getRunValidation, runsService.getRun);

router.delete(
  '/runs',
  authMiddleware,
  deleteRunValidation,
  runsService.deleteRun,
);

export default router;
