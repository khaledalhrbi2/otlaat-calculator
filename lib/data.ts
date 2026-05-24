import { demoData } from "./demo-data";
import type { TravelData } from "./types";

const DATA_ENDPOINT = process.env.GOOGLE_SHEETS_DATA_ENDPOINT;
const LOCAL_DATA_PATH = `${process.cwd()}/data/travel-data.json`;

export async function getTravelData(): Promise<TravelData> {
  const localData = await readLocalTravelData();
  if (localData) {
    return localData;
  }

  if (!DATA_ENDPOINT) {
    return demoData;
  }

  try {
    const response = await fetch(DATA_ENDPOINT, {
      next: { revalidate: 300 }
    });

    if (!response.ok) {
      return demoData;
    }

    const data = (await response.json()) as TravelData;
    return normalizeData(data);
  } catch {
    return demoData;
  }
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
    faqs: data.faqs ?? []
  };
}

async function readLocalTravelData(): Promise<TravelData | undefined> {
  try {
    const fs = await import("node:fs/promises");
    const raw = await fs.readFile(LOCAL_DATA_PATH, "utf8");
    return normalizeData(JSON.parse(raw) as TravelData);
  } catch {
    return undefined;
  }
}

export async function saveLocalTravelData(data: TravelData) {
  const fs = await import("node:fs/promises");
  await fs.mkdir(`${process.cwd()}/data`, { recursive: true });
  await fs.writeFile(LOCAL_DATA_PATH, `${JSON.stringify(normalizeData(data), null, 2)}\n`, "utf8");
}
