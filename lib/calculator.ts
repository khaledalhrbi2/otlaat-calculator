import type { CalculatorInput, CalculatorResult, TravelData, TravelPackage } from "./types";

const RANGE_FACTOR = 0.12;

export function formatSar(value: number) {
  return new Intl.NumberFormat("ar-SA-u-nu-latn", {
    style: "currency",
    currency: "SAR",
    maximumFractionDigits: 0
  }).format(Math.round(value));
}

export function calculateTrip(input: CalculatorInput, data: TravelData): CalculatorResult {
  const destination = data.destinations.find((item) => item.id === input.destinationId);
  if (!destination) {
    throw new Error("Destination not found");
  }

  const persons = Math.max(1, input.adults + input.children);
  const warnings: string[] = [];
  const hotel = data.hotelRates.find(
    (rate) => rate.destinationId === input.destinationId && rate.level === input.hotelLevel
  );
  const rooms = hotel ? Math.ceil(persons / hotel.occupancy) : 0;
  const hotels = hotel ? hotel.nightlyRate * input.nights * rooms : 0;

  if (!hotel) {
    warnings.push("لا توجد أسعار فندقية لهذا المستوى حاليا.");
  }

  const selectedTours = data.tours.filter((tour) => input.selectedTourIds.includes(tour.id));
  const tours = selectedTours.reduce((sum, tour) => {
    return sum + (tour.priceType === "per_person" ? tour.price * persons : tour.price);
  }, 0);

  const transfer = data.transfers.find((item) => item.id === input.transferId);
  const transfers = transfer?.price ?? 0;

  const driverRate = data.drivers.find((item) => item.destinationId === input.destinationId);
  const driver = input.includeDriver && driverRate ? driverRate.dailyRate * input.nights : 0;

  const expense = data.dailyExpenses.find(
    (item) => item.destinationId === input.destinationId && item.level === input.expenseLevel
  );
  const dailyExpenses = expense ? expense.perPersonDaily * persons * input.nights : 0;

  if (!expense) {
    warnings.push("لا توجد مصاريف يومية لهذا الاختيار حاليا.");
  }

  const subtotal = hotels + tours + transfers + driver + dailyExpenses;
  const packageMatch = findPackageMatch(input, persons, data);

  return {
    destinationName: destination.name,
    persons,
    subtotal,
    minTotal: Math.max(0, subtotal * (1 - RANGE_FACTOR)),
    maxTotal: subtotal * (1 + RANGE_FACTOR),
    breakdown: {
      hotels,
      tours,
      transfers,
      driver,
      dailyExpenses
    },
    packageMatch,
    warnings
  };
}

function findPackageMatch(input: CalculatorInput, persons: number, data: TravelData): TravelPackage | undefined {
  const matches = data.packages
    .filter((item) => item.status === "available")
    .filter((item) => item.destinationId === input.destinationId)
    .filter((item) => item.persons === persons)
    .filter((item) => item.hotelLevel === input.hotelLevel)
    .map((item) => ({
      item,
      distance: Math.abs(item.nights - input.nights)
    }))
    .sort((a, b) => a.distance - b.distance);

  return matches[0]?.distance <= 2 ? matches[0].item : undefined;
}
