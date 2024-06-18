const sharp= require('sharp');

module.exports=async function convertTowebP(originalPath,newPath)
{
      // Convert the image to WebP format
      try {
        await sharp(originalFilePath)
        .webp({ quality: 60 })
        .rotate()  // Auto-rotate based on EXIF data
        .toFile(newFilePath);
         console.log('Image converted to WebP successfully');

         sharp.cache(false); // used to unlock the file since the file is locked or in use 
   } catch (sharpError) {
    console.error('Sharp conversion error:', sharpError);
    throw new Error('Unsupported image format');
   }
}