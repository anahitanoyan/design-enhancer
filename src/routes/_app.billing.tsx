import { createFileRoute } from "@tanstack/react-router";
import { BillingScreen } from "@/screens/BillingScreen";
import { useScreenNav } from "@/lib/screen-nav";

export const Route = createFileRoute("/_app/billing")({
  head: () => ({
    meta: [
      { title: "Billing — OikOS" },
      { name: "description", content: "Choose between OikOS Free and Pro." },
    ],
  }),
  component: () => {
    const { onBack } = useScreenNav();
    return <BillingScreen onBack={onBack} />;
  },
});