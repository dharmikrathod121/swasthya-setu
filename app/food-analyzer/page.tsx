import FoodAnalyzerClient from "./food-analyzer-client";

export const metadata = {
  title: "Smart Food Ingredient Analyzer | Swasthya Setu",
  description: "Check a food or ingredient for allergens, additives and nutrition.",
};

export default function Page() {
  return <FoodAnalyzerClient />;
}
