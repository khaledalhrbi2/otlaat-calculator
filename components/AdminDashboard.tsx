"use client";

import { useEffect, useMemo, useState } from "react";
import { Plus, Save, Trash2 } from "lucide-react";
import type {
  DailyExpense,
  Destination,
  DriverRate,
  ExpenseLevel,
  HotelLevel,
  HotelRate,
  Tour,
  Transfer,
  TravelData,
  TravelPackage
} from "@/lib/types";

type TourDraft = {
  id: string;
  name: string;
  price: number;
  priceType: "per_person" | "per_car";
  hours: number;
  includesDriver: boolean;
};

type AdminForm = {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  sourceCurrency: string;
  sarRate: number;
  pricingNotes: string;
  hotels: Record<HotelLevel, number>;
  hotelOccupancy: number;
  transferPrice: number;
  driverDailyRate: number;
  driverHoursLimit: number;
  carType: string;
  expenses: Record<ExpenseLevel, number>;
  tours: TourDraft[];
  packageName: string;
  packageNights: number;
  packagePersons: number;
  packageHotelLevel: HotelLevel;
  packagePrice: number;
  packageNotes: string;
};

const hotelLevels: HotelLevel[] = ["3 نجوم", "4 نجوم", "5 نجوم", "منتجع فاخر"];
const expenseLevels: ExpenseLevel[] = ["اقتصادي", "متوسط", "فاخر"];

const emptyForm: AdminForm = {
  id: "",
  name: "",
  description: "",
  imageUrl: "",
  sourceCurrency: "SAR",
  sarRate: 1,
  pricingNotes: "",
  hotels: {
    "3 نجوم": 0,
    "4 نجوم": 0,
    "5 نجوم": 0,
    "منتجع فاخر": 0
  },
  hotelOccupancy: 2,
  transferPrice: 0,
  driverDailyRate: 0,
  driverHoursLimit: 10,
  carType: "سيارة خاصة",
  expenses: {
    اقتصادي: 0,
    متوسط: 0,
    فاخر: 0
  },
  tours: [],
  packageName: "",
  packageNights: 7,
  packagePersons: 2,
  packageHotelLevel: "4 نجوم",
  packagePrice: 0,
  packageNotes: ""
};

export function AdminDashboard() {
  const [data, setData] = useState<TravelData>();
  const [selectedId, setSelectedId] = useState("new");
  const [form, setForm] = useState<AdminForm>(emptyForm);
  const [status, setStatus] = useState("جار تحميل البيانات...");

  useEffect(() => {
    requestJson<TravelData>("/api/admin/travel-data")
      .then((payload: TravelData) => {
        setData(payload);
        setStatus("جاهز للتعديل");
      })
      .catch(() => setStatus("تعذر تحميل البيانات"));
  }, []);

  const activeDestination = useMemo(() => {
    return data?.destinations.find((destination) => destination.id === selectedId);
  }, [data, selectedId]);

  function update<K extends keyof AdminForm>(key: K, value: AdminForm[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function selectDestination(destinationId: string) {
    setSelectedId(destinationId);

    if (!data || destinationId === "new") {
      setForm(emptyForm);
      return;
    }

    const destination = data.destinations.find((item) => item.id === destinationId);
    if (destination) {
      setForm(formFromData(destination, data));
    }
  }

  function updateHotel(level: HotelLevel, value: number) {
    setForm((current) => ({
      ...current,
      hotels: { ...current.hotels, [level]: value }
    }));
  }

  function updateExpense(level: ExpenseLevel, value: number) {
    setForm((current) => ({
      ...current,
      expenses: { ...current.expenses, [level]: value }
    }));
  }

  function updateTour(index: number, patch: Partial<TourDraft>) {
    setForm((current) => ({
      ...current,
      tours: current.tours.map((tour, tourIndex) => (tourIndex === index ? { ...tour, ...patch } : tour))
    }));
  }

  function addTour() {
    setForm((current) => ({
      ...current,
      tours: [
        ...current.tours,
        {
          id: createId(current.name || "tour"),
          name: "",
          price: 0,
          priceType: "per_car",
          hours: 8,
          includesDriver: true
        }
      ]
    }));
  }

  function removeTour(index: number) {
    setForm((current) => ({
      ...current,
      tours: current.tours.filter((_, tourIndex) => tourIndex !== index)
    }));
  }

  async function saveDestination() {
    if (!data) {
      return;
    }

    if (!form.name.trim()) {
      setStatus("اكتب اسم الدولة أو المدينة أولا");
      return;
    }

    const destinationId = form.id || createId(form.name);
    const nextData = mergeFormIntoData({ ...form, id: destinationId }, data);
    setStatus("جار الحفظ...");

    try {
      await requestJson<TravelData>("/api/admin/travel-data", {
        method: "POST",
        body: JSON.stringify(nextData)
      });
    } catch {
      setStatus("تعذر حفظ البيانات");
      return;
    }

    setData(nextData);
    setSelectedId(destinationId);
    setStatus("تم الحفظ. الحاسبة تستخدم هذه الأرقام الآن.");
  }

  async function deleteDestination() {
    if (!data || selectedId === "new") {
      return;
    }

    const nextData: TravelData = {
      destinations: data.destinations.filter((item) => item.id !== selectedId),
      hotelRates: data.hotelRates.filter((item) => item.destinationId !== selectedId),
      tours: data.tours.filter((item) => item.destinationId !== selectedId),
      transfers: data.transfers.filter((item) => item.destinationId !== selectedId),
      drivers: data.drivers.filter((item) => item.destinationId !== selectedId),
      dailyExpenses: data.dailyExpenses.filter((item) => item.destinationId !== selectedId),
      packages: data.packages.filter((item) => item.destinationId !== selectedId),
      faqs: data.faqs
    };

    setStatus("جار الحذف...");
    await requestJson<TravelData>("/api/admin/travel-data", {
      method: "POST",
      body: JSON.stringify(nextData)
    });
    setData(nextData);
    setSelectedId("new");
    setForm(emptyForm);
    setStatus("تم حذف الوجهة");
  }

  return (
    <section className="admin-page">
      <div className="container admin-shell">
        <div className="admin-hero">
          <div>
            <p className="section-kicker">لوحة التحكم</p>
            <h1>إدارة أرقام الميزانية</h1>
            <p>أضف دولة أو مدينة، ثم أدخل أسعار الفنادق والجولات والسائق والمصاريف اليومية والباقات.</p>
          </div>
          <span className="admin-status">{status}</span>
        </div>

        <div className="admin-layout">
          <aside className="admin-sidebar">
            <button className={selectedId === "new" ? "admin-destination active" : "admin-destination"} onClick={() => selectDestination("new")}>
              + وجهة جديدة
            </button>
            {data?.destinations.map((destination) => (
              <button
                className={selectedId === destination.id ? "admin-destination active" : "admin-destination"}
                key={destination.id}
                onClick={() => selectDestination(destination.id)}
              >
                <strong>{destination.name}</strong>
                <span>{destination.pricingNotes || "بدون ملاحظات"}</span>
              </button>
            ))}
          </aside>

          <div className="admin-card">
            <div className="admin-card-head">
              <div>
                <h2>{activeDestination ? `تعديل ${activeDestination.name}` : "وجهة جديدة"}</h2>
                <p>كل الأرقام بالريال السعودي، ويمكنك تغيير العملة للمرجع فقط.</p>
              </div>
              <div className="admin-actions">
                {selectedId !== "new" ? (
                  <button className="danger-button" type="button" onClick={deleteDestination}>
                    <Trash2 size={17} aria-hidden="true" />
                    حذف
                  </button>
                ) : null}
                <button className="primary-button" type="button" onClick={saveDestination}>
                  <Save size={17} aria-hidden="true" />
                  حفظ
                </button>
              </div>
            </div>

            <div className="admin-form">
              <div className="form-section-title full">بيانات الوجهة</div>
              <AdminField label="اسم الدولة أو المدينة" value={form.name} onChange={(value) => update("name", value)} />
              <AdminField label="رابط صورة" value={form.imageUrl} onChange={(value) => update("imageUrl", value)} />
              <AdminField label="العملة المرجعية" value={form.sourceCurrency} onChange={(value) => update("sourceCurrency", value)} />
              <AdminField label="معامل التحويل للريال" type="number" value={form.sarRate} onChange={(value) => update("sarRate", Number(value))} />
              <AdminField className="full" label="وصف مختصر" value={form.description} onChange={(value) => update("description", value)} />
              <AdminField className="full" label="ملاحظات التسعير" value={form.pricingNotes} onChange={(value) => update("pricingNotes", value)} />

              <div className="form-section-title full">أسعار الفنادق لليلة</div>
              {hotelLevels.map((level) => (
                <AdminField
                  key={level}
                  label={level}
                  type="number"
                  value={form.hotels[level]}
                  onChange={(value) => updateHotel(level, Number(value))}
                />
              ))}
              <AdminField label="عدد الأشخاص في الغرفة" type="number" value={form.hotelOccupancy} onChange={(value) => update("hotelOccupancy", Number(value))} />

              <div className="form-section-title full">الخدمات والمصاريف</div>
              <AdminField label="استقبال وتوديع" type="number" value={form.transferPrice} onChange={(value) => update("transferPrice", Number(value))} />
              <AdminField label="سعر السائق اليومي" type="number" value={form.driverDailyRate} onChange={(value) => update("driverDailyRate", Number(value))} />
              <AdminField label="ساعات السائق" type="number" value={form.driverHoursLimit} onChange={(value) => update("driverHoursLimit", Number(value))} />
              <AdminField label="نوع السيارة" value={form.carType} onChange={(value) => update("carType", value)} />
              {expenseLevels.map((level) => (
                <AdminField
                  key={level}
                  label={`مصروف ${level} للشخص يوميا`}
                  type="number"
                  value={form.expenses[level]}
                  onChange={(value) => updateExpense(level, Number(value))}
                />
              ))}

              <div className="admin-subhead full">
                <div className="form-section-title">الجولات</div>
                <button className="secondary-button" type="button" onClick={addTour}>
                  <Plus size={17} aria-hidden="true" />
                  إضافة جولة
                </button>
              </div>
              {form.tours.map((tour, index) => (
                <div className="tour-editor full" key={`${tour.id}-${index}`}>
                  <AdminField label="اسم الجولة" value={tour.name} onChange={(value) => updateTour(index, { name: value })} />
                  <AdminField label="السعر" type="number" value={tour.price} onChange={(value) => updateTour(index, { price: Number(value) })} />
                  <label className="admin-field">
                    <span>طريقة التسعير</span>
                    <select value={tour.priceType} onChange={(event) => updateTour(index, { priceType: event.target.value as TourDraft["priceType"] })}>
                      <option value="per_car">للسيارة</option>
                      <option value="per_person">للشخص</option>
                    </select>
                  </label>
                  <AdminField label="عدد الساعات" type="number" value={tour.hours} onChange={(value) => updateTour(index, { hours: Number(value) })} />
                  <label className="admin-check">
                    <input
                      type="checkbox"
                      checked={tour.includesDriver}
                      onChange={(event) => updateTour(index, { includesDriver: event.target.checked })}
                    />
                    تشمل سائق
                  </label>
                  <button className="danger-button" type="button" onClick={() => removeTour(index)}>
                    حذف الجولة
                  </button>
                </div>
              ))}

              <div className="form-section-title full">باقة عطلاتكم الاختيارية</div>
              <AdminField label="اسم الباقة" value={form.packageName} onChange={(value) => update("packageName", value)} />
              <AdminField label="عدد الليالي" type="number" value={form.packageNights} onChange={(value) => update("packageNights", Number(value))} />
              <AdminField label="عدد الأشخاص" type="number" value={form.packagePersons} onChange={(value) => update("packagePersons", Number(value))} />
              <label className="admin-field">
                <span>مستوى الفندق للباقة</span>
                <select value={form.packageHotelLevel} onChange={(event) => update("packageHotelLevel", event.target.value as HotelLevel)}>
                  {hotelLevels.map((level) => (
                    <option key={level} value={level}>
                      {level}
                    </option>
                  ))}
                </select>
              </label>
              <AdminField label="سعر الباقة" type="number" value={form.packagePrice} onChange={(value) => update("packagePrice", Number(value))} />
              <AdminField className="full" label="ملاحظات الباقة" value={form.packageNotes} onChange={(value) => update("packageNotes", value)} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function AdminField({
  label,
  value,
  onChange,
  type = "text",
  className = ""
}: {
  label: string;
  value: string | number;
  onChange: (value: string) => void;
  type?: "text" | "number";
  className?: string;
}) {
  return (
    <label className={`admin-field ${className}`}>
      <span>{label}</span>
      <input type={type} value={value} onChange={(event) => onChange(event.target.value)} />
    </label>
  );
}

function requestJson<T>(url: string, options: { method?: "GET" | "POST"; body?: string } = {}): Promise<T> {
  if (typeof window !== "undefined" && typeof window.fetch === "function") {
    return window
      .fetch(url, {
        method: options.method ?? "GET",
        cache: "no-store",
        headers: { "Content-Type": "application/json" },
        body: options.body
      })
      .then(async (response) => {
        if (!response.ok) {
          throw new Error(`Request failed: ${response.status}`);
        }

        return (await response.json()) as T;
      });
  }

  return new Promise((resolve, reject) => {
    const request = new XMLHttpRequest();
    request.open(options.method ?? "GET", url);
    request.setRequestHeader("Content-Type", "application/json");
    request.onload = () => {
      if (request.status < 200 || request.status >= 300) {
        reject(new Error(`Request failed: ${request.status}`));
        return;
      }

      resolve(JSON.parse(request.responseText) as T);
    };
    request.onerror = () => reject(new Error("Request failed"));
    request.send(options.body ?? null);
  });
}

function formFromData(destination: Destination, data: TravelData): AdminForm {
  const hotels = { ...emptyForm.hotels };
  data.hotelRates
    .filter((item) => item.destinationId === destination.id)
    .forEach((item) => {
      hotels[item.level] = item.nightlyRate;
    });

  const expenses = { ...emptyForm.expenses };
  data.dailyExpenses
    .filter((item) => item.destinationId === destination.id)
    .forEach((item) => {
      expenses[item.level] = item.perPersonDaily;
    });

  const transfer = data.transfers.find((item) => item.destinationId === destination.id);
  const driver = data.drivers.find((item) => item.destinationId === destination.id);
  const packageItem = data.packages.find((item) => item.destinationId === destination.id);
  const hotelOccupancy = data.hotelRates.find((item) => item.destinationId === destination.id)?.occupancy ?? 2;

  return {
    ...emptyForm,
    id: destination.id,
    name: destination.name,
    description: destination.description,
    imageUrl: destination.imageUrl,
    sourceCurrency: destination.sourceCurrency,
    sarRate: destination.sarRate,
    pricingNotes: destination.pricingNotes,
    hotels,
    hotelOccupancy,
    transferPrice: transfer?.price ?? 0,
    driverDailyRate: driver?.dailyRate ?? 0,
    driverHoursLimit: driver?.hoursLimit ?? 10,
    carType: driver?.carType ?? "سيارة خاصة",
    expenses,
    tours: data.tours
      .filter((item) => item.destinationId === destination.id)
      .map((item) => ({
        id: item.id,
        name: item.name,
        price: item.price,
        priceType: item.priceType,
        hours: item.hours,
        includesDriver: item.includesDriver
      })),
    packageName: packageItem?.name ?? "",
    packageNights: packageItem?.nights ?? 7,
    packagePersons: packageItem?.persons ?? 2,
    packageHotelLevel: packageItem?.hotelLevel ?? "4 نجوم",
    packagePrice: packageItem?.price ?? 0,
    packageNotes: packageItem?.notes ?? ""
  };
}

function mergeFormIntoData(form: AdminForm, data: TravelData): TravelData {
  const destination: Destination = {
    id: form.id,
    name: form.name.trim(),
    status: "active",
    description: form.description.trim(),
    imageUrl: form.imageUrl.trim() || "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=900&q=80",
    sourceCurrency: form.sourceCurrency.trim() || "SAR",
    sarRate: Number(form.sarRate) || 1,
    pricingNotes: form.pricingNotes.trim()
  };

  const hotelRates: HotelRate[] = hotelLevels
    .filter((level) => Number(form.hotels[level]) > 0)
    .map((level) => ({
      destinationId: form.id,
      level,
      nightlyRate: Number(form.hotels[level]),
      occupancy: Number(form.hotelOccupancy) || 2,
      season: "normal"
    }));

  const dailyExpenses: DailyExpense[] = expenseLevels
    .filter((level) => Number(form.expenses[level]) > 0)
    .map((level) => ({
      destinationId: form.id,
      level,
      perPersonDaily: Number(form.expenses[level])
    }));

  const transfers: Transfer[] =
    Number(form.transferPrice) > 0
      ? [{ id: `${form.id}-round`, destinationId: form.id, service: "استقبال وتوديع", price: Number(form.transferPrice) }]
      : [];

  const drivers: DriverRate[] = [
    {
      destinationId: form.id,
      dailyRate: Number(form.driverDailyRate) || 0,
      hoursLimit: Number(form.driverHoursLimit) || 0,
      carType: form.carType.trim() || "سيارة خاصة"
    }
  ];

  const tours: Tour[] = form.tours
    .filter((tour) => tour.name.trim() && Number(tour.price) > 0)
    .map((tour, index) => ({
      id: tour.id || `${form.id}-tour-${index + 1}`,
      destinationId: form.id,
      name: tour.name.trim(),
      price: Number(tour.price),
      priceType: tour.priceType,
      hours: Number(tour.hours) || 0,
      includesDriver: tour.includesDriver
    }));

  const packages: TravelPackage[] =
    form.packageName.trim() && Number(form.packagePrice) > 0
      ? [
          {
            id: `pkg-${form.id}`,
            destinationId: form.id,
            name: form.packageName.trim(),
            nights: Number(form.packageNights) || 1,
            persons: Number(form.packagePersons) || 2,
            hotelLevel: form.packageHotelLevel,
            price: Number(form.packagePrice),
            status: "available",
            notes: form.packageNotes.trim()
          }
        ]
      : [];

  return {
    destinations: [...data.destinations.filter((item) => item.id !== form.id), destination],
    hotelRates: [...data.hotelRates.filter((item) => item.destinationId !== form.id), ...hotelRates],
    tours: [...data.tours.filter((item) => item.destinationId !== form.id), ...tours],
    transfers: [...data.transfers.filter((item) => item.destinationId !== form.id), ...transfers],
    drivers: [...data.drivers.filter((item) => item.destinationId !== form.id), ...drivers],
    dailyExpenses: [...data.dailyExpenses.filter((item) => item.destinationId !== form.id), ...dailyExpenses],
    packages: [...data.packages.filter((item) => item.destinationId !== form.id), ...packages],
    faqs: data.faqs
  };
}

function createId(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\u0600-\u06ff]+/gi, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48) || `destination-${Date.now()}`;
}
