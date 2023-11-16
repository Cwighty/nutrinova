import { Alert, Autocomplete, Chip, Skeleton, TextField } from '@mui/material';
import { useGetRecipeTagsQuery } from './tagHooks';

interface TagInputProps {
  tags: string[];
  setTags: (tags: string[]) => void;
}

const TagInput: React.FC<TagInputProps> = ({ tags, setTags }) => {
  const { data: recipeTags, isLoading: recipeTagsLoading, isError: recipeTagsIsError } = useGetRecipeTagsQuery();

  if (recipeTagsLoading) {
    return (
      <Skeleton variant="rounded" sx={{ mt: 2 }} width={'auto'} height={40} />
    )
  }
  if (recipeTagsIsError) {
    return <Alert severity="error">Error loading recipe tags, try again later</Alert>;
  }
  return (<>
    {recipeTags && (
      <Autocomplete
        value={tags}
        multiple
        id="tags-filled"
        options={recipeTags}
        freeSolo
        onChange={(_, value) => { setTags(value) }}
        renderTags={(value: readonly string[]) =>
          value.map((option: string) => (
            <Chip variant="outlined" label={option} key={option} />
          ))
        }
        renderInput={(params) => (
          <TextField {...params}
            label="New Tag"
            variant="outlined"
            fullWidth
            margin="normal"
          />
        )}
      />

    )}
  </>
  );
};

export default TagInput;

