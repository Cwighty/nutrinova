import { useGetFoodSearchResultsQuery } from "@/app/(authorized)/food/foodHooks";
import { Box } from "@mui/material";
import { PrepMealCard } from "./PrepMealCard";

interface SearchAllProps {
  searchKeyword: string;
}

export const SearchAll: React.FC<SearchAllProps> = ({ searchKeyword }: SearchAllProps) => {
  const filterParams = {
    foodName: searchKeyword,
    filterOption: "Foundation",
  };

  const { data, isLoading } = useGetFoodSearchResultsQuery(filterParams);

  return (
    <Box>
      {isLoading && <div>Loading...</div>}
      {data && <div>{data.length} results</div>}
      {data && data.slice(0, 10).map((x) => {
        return <PrepMealCard key={x.id} description={x.description} amount={0} unit={x.servingSizeUnit} calories={0} />
      })}
    </Box>
  )
};