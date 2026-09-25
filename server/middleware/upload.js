import multer from 'multer';

// Memory storage to process PDF buffers directly with pdf-parse
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const ext = (file.originalname || '').toLowerCase();
  const allowedMimeTypes = ['application/pdf', 'text/plain', 'text/markdown', 'application/json', 'application/octet-stream'];

  if (
    allowedMimeTypes.includes(file.mimetype) ||
    ext.endsWith('.pdf') ||
    ext.endsWith('.txt') ||
    ext.endsWith('.md')
  ) {
    cb(null, true);
  } else {
    const customErr = new Error('Invalid file type. Please upload a valid PDF, TXT, or Markdown document.');
    customErr.status = 400;
    cb(customErr, false);
  }
};

const uploadMulter = multer({
  storage,
  limits: { fileSize: 25 * 1024 * 1024 }, // 25 MB max file size
  fileFilter
});

export const upload = uploadMulter;
