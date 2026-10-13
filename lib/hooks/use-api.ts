"use client";

import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export function useHospitals(params?: Record<string, string>) {
  const qs = new URLSearchParams(params ?? {}).toString();
  const url = `/api/hospitals${qs ? `?${qs}` : ""}`;
  return useSWR(url, fetcher);
}

export function useDoctors(params?: Record<string, string>) {
  const qs = new URLSearchParams(params ?? {}).toString();
  const url = `/api/doctors${qs ? `?${qs}` : ""}`;
  return useSWR(url, fetcher);
}

export function useAppointments(userId?: string) {
  const qs = userId ? `?user_id=${userId}` : "";
  const url = `/api/appointments${qs}`;
  return useSWR(userId ? url : null, fetcher);
}

export function useMedicines(params?: Record<string, string>) {
  const qs = new URLSearchParams(params ?? {}).toString();
  const url = `/api/medicines${qs ? `?${qs}` : ""}`;
  return useSWR(url, fetcher);
}

export function useSearch(query?: string) {
  const url = query ? `/api/search?q=${encodeURIComponent(query)}` : null;
  return useSWR(url, fetcher);
}

export function useReviews(hospitalId?: string) {
  const url = hospitalId ? `/api/reviews?hospital_id=${hospitalId}` : null;
  return useSWR(url, fetcher);
}

export function useQueue(hospitalId?: string) {
  const url = hospitalId ? `/api/queue?hospital_id=${hospitalId}` : null;
  return useSWR(url, fetcher);
}
