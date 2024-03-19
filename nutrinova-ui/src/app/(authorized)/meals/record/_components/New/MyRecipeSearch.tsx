
interface MyRecipeSearchProps {
  searchKeyword: string;
}

export const MyRecipeSearch: React.FC<MyRecipeSearchProps> = ({ searchKeyword }: MyRecipeSearchProps) => {
  return (
    <div>
      <h1>Search All</h1>
      <p>Search keyword: {searchKeyword}</p>
    </div>
  )
};