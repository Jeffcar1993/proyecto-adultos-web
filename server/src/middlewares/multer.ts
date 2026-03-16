import multer from 'multer';

// Usamos MemoryStorage para no llenar el disco del servidor con basura
// Las fotos pasan directamente de la RAM a Cloudinary
const storage = multer.memoryStorage();

export const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // Limite de 5MB por foto
  },
  fileFilter: (req, file, cb) => {
    // Validar que solo sean imágenes
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Solo se permiten imágenes') as any, false);
    }
  },
});