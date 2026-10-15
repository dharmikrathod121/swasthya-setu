import { redirect } from "next/navigation";

// Standalone /doctors page removed (Task 9) — the directory now lives at
// /hospitals with [Hospitals | Doctors | Clinics] tabs.
export default function DoctorsPage() {
  redirect("/hospitals?tab=doctors");
}
