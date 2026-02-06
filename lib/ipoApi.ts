import type { IPOApiResponse } from "@/types";
import { mapApiIposToIpos } from "./ipoApiMapper";

const IPO_API_BASE = "https://api.ipogmptracker.com/api";

export interface IPOsApiResult {
  success: boolean;
  count: number;
  data: IPOApiResponse[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export interface FetchIPOsResult {
  ipos: IPO[];
  pagination: IPOsApiResult["pagination"];
  error: string | null;
}

export async function fetchIPOs(
  page: number = 1,
  limit: number = 10
): Promise<FetchIPOsResult> {
  try {
    const url = `${IPO_API_BASE}/ipos?page=${page}&limit=${limit}`;
    const res = await fetch(url);
    if (!res.ok) {
      return {
        ipos: [],
        pagination: {
          total: 0,
          page: 1,
          limit,
          totalPages: 0,
          hasNextPage: false,
          hasPrevPage: false,
        },
        error: `Failed to load: ${res.status}`,
      };
    }
    const json: IPOsApiResult = await res.json();
    const ipos = mapApiIposToIpos(json.data ?? []);
    return {
      ipos,
      pagination: json.pagination ?? {
        total: json.count ?? 0,
        page,
        limit,
        totalPages: 1,
        hasNextPage: false,
        hasPrevPage: false,
      },
      error: null,
    };
  } catch (e) {
    const message = e instanceof Error ? e.message : "Failed to fetch IPOs";
    return {
      ipos: [],
      pagination: {
        total: 0,
        page: 1,
        limit,
        totalPages: 0,
        hasNextPage: false,
        hasPrevPage: false,
      },
      error: message,
    };
  }
}
