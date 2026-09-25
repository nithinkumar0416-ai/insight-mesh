import express from 'express';
import { analyzeResearchDocument, analyzeMultiDocuments, verifyClaim } from '../controllers/aiController.js';
import { authenticateJWT } from '../middleware/auth.js';

const router = express.Router();

router.use(authenticateJWT);

router.post('/analyze-document', analyzeResearchDocument);
router.post('/graph-synthesis', analyzeMultiDocuments);
router.post('/verify-claim', verifyClaim);

export default router;
