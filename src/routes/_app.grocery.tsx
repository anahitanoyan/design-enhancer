import { createFileRoute } from "@tanstack/react-router";
import { DetailedGroceryScreen } from "@/screens/DetailedGroceryScreen";
import { useScreenNav } from "@/lib/screen-nav";

export const Route = createFileRoute("/_app/grocery")({
  head: () => ({
    meta: [
      { title: "Grocery — OikOS" },
      { name: "description", content: "AI-curated grocery list built from your meal plan." },
      { property: "og:title", content: "Grocery — OikOS" },
      { property: "og:description", content: "AI-curated grocery list." },
    ],
  }),
  component: GroceryPage,
});

function GroceryPage() {
  const { onBack } = useScreenNav();
  return <DetailedGroceryScreen onBack={onBack} />;
}