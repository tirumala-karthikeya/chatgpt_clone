import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export { cloudinary };

// Helper function to upload files
export async function uploadFile(file: Buffer, publicId?: string) {
  try {
    const uploadResult = await cloudinary.uploader.upload(
      `data:image/jpeg;base64,${file.toString('base64')}`,
      {
        public_id: publicId,
        resource_type: 'auto',
        folder: 'galaxy-ai'
      }
    );
    return uploadResult;
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw error;
  }
}

// Helper function to delete files
export async function deleteFile(publicId: string) {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    console.error('Cloudinary delete error:', error);
    throw error;
  }
}
