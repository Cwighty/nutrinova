import React, { useState } from 'react';
import { Chip, TextField } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

interface TagInputProps {
  tags: string[];
  setTags: (tags: string[]) => void;
}

const TagInput: React.FC<TagInputProps> = ({ tags, setTags }) => {
  const [inputValue, setInputValue] = useState('');

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && inputValue) {
      setTags([...tags, inputValue]);
      setInputValue('');
      e.stopPropagation();
      e.preventDefault();
    }
  };

  const handleDeleteTag = (tagToDelete: string) => {
    setTags(tags.filter((tag) => tag !== tagToDelete));
  };

  return (<>
    <TextField
      label="New Tag"
      value={inputValue}
      onChange={(e) => setInputValue(e.target.value)}
      onKeyDown={handleAddTag}
      variant="outlined"
      fullWidth
      margin="normal"
    />
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
      {tags.map((tag, index) => (
        <Chip
          key={index}
          label={tag}
          onDelete={() => handleDeleteTag(tag)}
          deleteIcon={<CloseIcon />}
        />
      ))}
    </div>
  </>
  );
};

export default TagInput;

