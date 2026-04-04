import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();

const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } = process.env;

if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
  throw new Error('Faltan variables de entorno de Cloudinary. Verifica CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY y CLOUDINARY_API_SECRET.');
}

cloudinary.config({
  cloud_name: CLOUDINARY_CLOUD_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET,
});

/**
 * Sube un archivo a Cloudinary recibiendo un buffer
 * Esto es más seguro que guardar archivos temporales en el disco del servidor
 */
export const uploadToCloudinary = (fileBuffer: Buffer, folder: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: folder,
        resource_type: 'auto',
      },
      (error, result) => {
        if (error) return reject(error);
        if (result) resolve(result.secure_url);
      }
    );

    uploadStream.end(fileBuffer);
  });
};

/**
 * Elimina una imagen de Cloudinary a partir de su URL segura
 * Extrae el public_id del path de la URL (incluyendo la carpeta)
 */
export const deleteFromCloudinary = (url: string): Promise<void> => {
  const uploadIndex = url.indexOf('/upload/');
  if (uploadIndex === -1) return Promise.resolve();
  const afterUpload = url.slice(uploadIndex + 8);
  const withoutVersion = afterUpload.replace(/^v\d+\//, '');
  const publicId = withoutVersion.replace(/\.[^.]+$/, '');
  return new Promise((resolve) => {
    cloudinary.uploader.destroy(publicId, () => resolve()); // best effort
  });
};

export default cloudinary;