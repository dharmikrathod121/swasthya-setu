export const WHATSAPP_NUMBER =
  process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "919978624295";

export function whatsappLink(message: string): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

export function doctorBookingLink(
  doctorName: string,
  options?: {
    specialty?: string | null;
    hospital?: string | null;
    preferredTime?: string | null;
  },
): string {
  const specialty = options?.specialty?.trim();
  const hospital = options?.hospital?.trim();
  const preferredTime = options?.preferredTime?.trim();

  let message = `Hi, I'd like to book an appointment with ${doctorName.trim()}`;
  if (specialty) message += ` (${specialty})`;
  if (hospital) message += ` — ${hospital}`;
  if (preferredTime) message += `. Preferred: ${preferredTime}`;
  message += ".";

  return whatsappLink(message);
}

export function generalEnquiryLink(): string {
  return whatsappLink(
    "Hi, I need help with SwasthyaSetu (hospitals, doctors, or AI health tools).",
  );
}

export const waLink = whatsappLink;
