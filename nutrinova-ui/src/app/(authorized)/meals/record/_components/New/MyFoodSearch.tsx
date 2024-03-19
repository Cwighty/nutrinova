interface MyFoodSearchProps {
  searchKeyword: string;
}

export const MyFoodSearch: React.FC<MyFoodSearchProps> = ({ searchKeyword }: MyFoodSearchProps) => {
  return (
    <div>
      <h1>Search All</h1>
      <p>Search keyword: {searchKeyword}</p>
    </div>
  )
};