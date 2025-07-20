import React, { useRef } from 'react';
import { Cropper } from 'react-cropper';
import '../styles/cropper.css'; 

const ImageCropper = ({ imageSrc, onCropComplete, onClose }) => {
  const cropperRef = useRef(null);

  const handleDone = () => {
    const cropper = cropperRef.current?.cropper;
    if (cropper) {
      cropper.getCroppedCanvas().toBlob((blob) => {
        if (blob) {
          onCropComplete(blob); 
          onClose();
        }
      }, 'image/jpeg');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-70 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-4 max-w-3xl w-full shadow-xl relative">
        <Cropper
          src={imageSrc}
          style={{ height: 400, width: '100%' }}
          initialAspectRatio={0}
          guides={true}
          viewMode={1}
          background={false}
          responsive={true}
          autoCropArea={1}
          checkOrientation={false}
          ref={cropperRef}
        />

        <div className="flex justify-end gap-4 mt-4">
          <button
            onClick={onClose}
            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
          >
            Cancel
          </button>
          <button
            onClick={handleDone}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
          >
            Done Cropping
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImageCropper;
