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

router.get('/runs', async (req, res) => await runsService.getAllRuns(req, res));
router.get(
  '/runs/all',
  authMiddleware,
  async (req, res) => await runsService.getAllRuns(req, res, true),
);
router.get('/runs/:id', getRunValidation, runsService.getRun);
router.get(
  '/runs/:id/leaderboard',
  getRunValidation,
  runsService.getLeaderboard,
);

router.delete(
  '/runs/:id',
  authMiddleware,
  getRunValidation,
  runsService.deleteRun,
);

export default router;
