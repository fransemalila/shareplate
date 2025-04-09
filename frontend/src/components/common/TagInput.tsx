import React, { useState } from 'react';
import { Tag } from '../../types';

interface TagInputProps {
  tags: Tag[];
  onTagsChange: (tags: Tag[]) => void;
  className?: string;
}

const TagInput: React.FC<TagInputProps> = ({
  tags,
  onTagsChange,
  className = '',
}) => {
  const [input, setInput] = useState('');

  const colors = [
    'bg-blue-100 text-blue-800',
    'bg-green-100 text-green-800',
    'bg-yellow-100 text-yellow-800',
    'bg-red-100 text-red-800',
    'bg-purple-100 text-purple-800',
  ];

  const addTag = () => {
    if (input.trim()) {
      const newTag: Tag = {
        id: Math.random().toString(36).substr(2, 9),
        name: input.trim(),
        color: colors[Math.floor(Math.random() * colors.length)],
      };
      onTagsChange([...tags, newTag]);
      setInput('');
    }
  };

  const removeTag = (tagId: string) => {
    onTagsChange(tags.filter(tag => tag.id !== tagId));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    }
  };

  return (
    <div className={className}>
      <div className="flex flex-wrap gap-2 mb-2">
        {tags.map(tag => (
          <span
            key={tag.id}
            className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${tag.color}`}
          >
            {tag.name}
            <button
              type="button"
              onClick={() => removeTag(tag.id)}
              className="ml-2 focus:outline-none"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </span>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Add a tag..."
          className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
        />
        <button
          type="button"
          onClick={addTag}
          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
        >
          Add
        </button>
      </div>
    </div>
  );
};

export default TagInput; 