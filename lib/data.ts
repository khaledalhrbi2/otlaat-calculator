import { demoData } from "./demo-data";
import type { TravelData } from "./types";

const DATA_ENDPOINT = process.env.GOOGLE_SHEETS_DATA_ENDPOINT;
const BLOB_FILENAME = "travel-data.json";

// ====== Vercel Blob ======

async function readBlobTravelData(): Promise<TravelData | undefined> {
  try {
    const { list } = await import("@vercel/blob");
    const { blobs } = await list({ prefix: BLOB_FILENAME });
    if (blobs.length === 0) return undefined;

    const response = await fetch(blobs[0].url, { next: { revalidate: 60 } });
    if (!response.ok) return undefined;

    const data = (await response.json()) as TravelData;
    return normalizeData(data);
  } catch {
    return undefined;
  }
}

export async function saveTravelData(data: TravelData): Promise<void> {
  const { put } = await import("@vercel/blob");
  const content = JSON.stringify(normalizeData(data));
  await put(BLOB_FILENAME, content, {
    access: "public",
    addRandomSuffix: false,
    contentType: "application/json",
  });
}

// ====== Local file (development only) ======

const LOCAL_DATA_PATH = `${process.cwd()}/data/travel-data.json`;

async function readLocalTravelData(): Promise<TravelData | undefined> {
  try {
    const fs = await import("node:fs/promises");
    const raw = await fs.readFile(LOCAL_DATA_PATH, "utf8");
    return normalizeData(JSON.parse(raw) as TravelData);
  } catch {
    return undefined;
  }
}

// ====== Main ======

export async function getTravelData(): Promise<TravelData> {
  // 1. Vercel Blob (production persistent storage)
  const blobData = await readBlobTravelData();
  if (blobData) return blobData;

  // 2. Local file (development)
  const localData = await readLocalTravelData();
  if (localData) return localData;

  // 3. Google Sheets endpoint
  if (DATA_ENDPOINT) {
    try {
      const response = await fetch(DATA_ENDPOINT, {
        next: { revalidate: 300 },
      });
      if (response.ok) {
        const data = (await response.json()) as TravelData;
        return normalizeData(data);
      }
    } catch {
      // fall through
    }
  }

  // 4. Demo data fallback
  return demoData;
}

function normalizeData(data: TravelData): TravelData {
  return {
    destinations: data.destinations ?? [],
    hotelRates: data.hotelRates ?? [],
    tours: data.tours ?? [],
    transfers: data.transfers ?? [],
    drivers: data.drivers ?? [],
    dailyExpenses: data.dailyExpenses ?? [],
    packages: data.packages ?? [],
    faqs: data.faqs ?? [],
  };
}
