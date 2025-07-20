import React from 'react';

const ImageUploader = ({ onImageSelected }) => {
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const tempURL = URL.createObjectURL(file);
      onImageSelected(tempURL, file); 
    }
  };

  return (
    <div className="mb-4">
      <label className="block font-medium text-sm sm:text-base text-cyan-200 mb-1">
        Upload Meme Image:
      </label>
      <input
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        className="w-full border border-gray-300 rounded-md p-2 text-sm sm:text-base cursor-pointer"
      />
    </div>
  );
};

export default ImageUploader;
