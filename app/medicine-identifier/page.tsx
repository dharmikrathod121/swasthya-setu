import MedicineIdentifierClient from "./medicine-identifier-client";

export const metadata = {
  title: "AI Medicine Identifier | Swasthya Setu",
  description: "Photograph a pill to identify it and check uses and side effects.",
};

export default function Page() {
  return <MedicineIdentifierClient />;
}
