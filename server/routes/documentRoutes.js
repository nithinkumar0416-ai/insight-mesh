import express from 'express';
import { uploadDocument, getDocuments, getDocumentById, deleteDocument } from '../controllers/documentController.js';
import { authenticateJWT } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';

const router = express.Router();

router.use(authenticateJWT);

router.post('/upload', upload.single('file'), uploadDocument);
router.get('/', getDocuments);
router.get('/:id', getDocumentById);
router.delete('/:id', deleteDocument);

export default router;
