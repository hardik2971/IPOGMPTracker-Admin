import type { IPO, IPOApiResponse } from "@/types";

/**
 * Converts API date string (e.g. "Feb 4, 2026") to ISO date string "YYYY-MM-DD"
 */
function toISODateString(dateStr: string | undefined | null): string {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

/**
 * Maps API current_status to app status
 */
function mapStatus(currentStatus: string): "upcoming" | "live" | "closed" {
  const s = (currentStatus || "").toLowerCase();
  if (s === "open" || s === "live") return "live";
  if (s === "closed") return "closed";
  return "upcoming";
}

/**
 * Converts a single IPO API response to the app's IPO type.
 */
export function mapApiIpoToIpo(api: IPOApiResponse): IPO {
  const openDate = toISODateString(api.open);
  const closeDate = toISODateString(api.close);
  const createdAt = api.created_at
    ? toISODateString(api.created_at.split("T")[0]) || api.created_at.split("T")[0]
    : openDate || closeDate || "";

  return {
    id: String(api.id),
    name: api.name ?? "",
    companyName: api.name ?? "",
    openDate: openDate || "",
    closeDate: closeDate || "",
    priceBand: {
      min: parseFloat(api.min_price) || 0,
      max: parseFloat(api.max_price) || 0,
    },
    lotSize: Number(api.lot_size) || 0,
    status: mapStatus(api.current_status),
    createdAt,
    iconUrl: api.icon_url,
    ipoType: api.ipo_type,
    premium: api.premium?.trim(),
    issueSize: api.issue_size,
  };
}

/**
 * Converts an array of IPO API responses to the app's IPO type.
 */
export function mapApiIposToIpos(apiList: IPOApiResponse[]): IPO[] {
  return (apiList ?? []).map(mapApiIpoToIpo);
}
