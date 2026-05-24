export type Season = "normal" | "high";
export type PriceType = "per_person" | "per_car";
export type PackageStatus = "available" | "unavailable";
export type HotelLevel = "3 نجوم" | "4 نجوم" | "5 نجوم" | "منتجع فاخر";
export type ExpenseLevel = "اقتصادي" | "متوسط" | "فاخر";

export type Destination = {
  id: string;
  name: string;
  status: "active" | "inactive";
  description: string;
  imageUrl: string;
  sourceCurrency: string;
  sarRate: number;
  pricingNotes: string;
};

export type HotelRate = {
  destinationId: string;
  level: HotelLevel;
  nightlyRate: number;
  occupancy: number;
  season: Season;
};

export type Tour = {
  id: string;
  destinationId: string;
  name: string;
  price: number;
  priceType: PriceType;
  hours: number;
  includesDriver: boolean;
};

export type Transfer = {
  id: string;
  destinationId: string;
  service: "استقبال" | "توديع" | "استقبال وتوديع";
  price: number;
};

export type DriverRate = {
  destinationId: string;
  dailyRate: number;
  hoursLimit: number;
  carType: string;
};

export type DailyExpense = {
  destinationId: string;
  level: ExpenseLevel;
  perPersonDaily: number;
};

export type TravelPackage = {
  id: string;
  destinationId: string;
  name: string;
  nights: number;
  persons: number;
  hotelLevel: HotelLevel;
  price: number;
  status: PackageStatus;
  link?: string;
  notes: string;
};

export type FAQ = {
  question: string;
  answer: string;
  page?: string;
};

export type TravelData = {
  destinations: Destination[];
  hotelRates: HotelRate[];
  tours: Tour[];
  transfers: Transfer[];
  drivers: DriverRate[];
  dailyExpenses: DailyExpense[];
  packages: TravelPackage[];
  faqs: FAQ[];
};

export type CalculatorInput = {
  destinationId: string;
  travelDate?: string;
  travelMonth?: string;
  nights: number;
  adults: number;
  children: number;
  hotelLevel: HotelLevel;
  selectedTourIds: string[];
  transferId?: string;
  includeDriver: boolean;
  expenseLevel: ExpenseLevel;
  customerName?: string;
  customerPhone?: string;
};

export type CostBreakdown = {
  hotels: number;
  tours: number;
  transfers: number;
  driver: number;
  dailyExpenses: number;
};

export type CalculatorResult = {
  destinationName: string;
  persons: number;
  subtotal: number;
  minTotal: number;
  maxTotal: number;
  breakdown: CostBreakdown;
  packageMatch?: TravelPackage;
  warnings: string[];
};
