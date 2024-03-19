interface SearchAllProps {
  searchKeyword: string;
}

export const SearchAll: React.FC<SearchAllProps> = ({ searchKeyword }: SearchAllProps) => {
  return (
    <div>
      <h1>Search All</h1>
      <p>Search keyword: {searchKeyword}</p>
    </div>
  )
};