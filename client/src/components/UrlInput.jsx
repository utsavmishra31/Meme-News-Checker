import React from 'react';

const UrlInput = ({ link, setLink }) => {
  return (
    <div className="mb-6">
      <label className="block font-medium text-sm sm:text-base text-cyan-200 mb-1">
        Or Paste Meme Link:
      </label>
      <input
        type="text"
        placeholder="https://example.com/meme.jpg"
        value={link}
        onChange={(e) => setLink(e.target.value)}
        className="w-full border border-gray-500 bg-black/40 text-white placeholder-gray-400 rounded-md p-2 text-sm sm:text-base"
      />
    </div>
  );
};

export default UrlInput;
