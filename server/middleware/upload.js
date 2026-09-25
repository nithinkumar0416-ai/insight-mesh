import multer from 'multer';

// Memory storage to process PDF buffers directly with pdf-parse
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowedTypes = ['application/pdf', 'text/plain', 'text/markdown', 'application/json'];
  const ext = file.originalname.toLowerCase();

  if (allowedTypes.includes(file.mimetype) || ext.endsWith('.pdf') || ext.endsWith('.txt') || ext.endsWith('.md')) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only PDF, TXT, and Markdown documents are supported.'), false);
  }
};

export const upload = multer({
  storage,
  limits: { fileSize: 20 * 1024 * 1024 }, // 20 MB max file size
  fileFilter
});
