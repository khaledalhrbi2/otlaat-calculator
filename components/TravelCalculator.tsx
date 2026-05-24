"use client";

import { useMemo, useState } from "react";
import { BedDouble, CalendarDays, CarFront, MessageCircle, ReceiptText, Sparkles, UserRound } from "lucide-react";
import { calculateTrip, formatSar } from "@/lib/calculator";
import type { CalculatorInput, ExpenseLevel, HotelLevel, TravelData } from "@/lib/types";

type LeadResponse = {
  leadId: string;
  whatsappUrl: string;
};

const months = [
  "يناير",
  "فبراير",
  "مارس",
  "أبريل",
  "مايو",
  "يونيو",
  "يوليو",
  "أغسطس",
  "سبتمبر",
  "أكتوبر",
  "نوفمبر",
  "ديسمبر"
];

export function TravelCalculator({ data }: { data: TravelData }) {
  const activeDestinations = data.destinations.filter((item) => item.status === "active");
  const firstDestination = activeDestinations[0]?.id ?? "";
  const [input, setInput] = useState<CalculatorInput>({
    destinationId: firstDestination,
    travelDate: "",
    travelMonth: months[new Date().getMonth()],
    nights: 7,
    adults: 2,
    children: 0,
    hotelLevel: "4 نجوم",
    selectedTourIds: [],
    transferId: data.transfers.find((item) => item.destinationId === firstDestination)?.id,
    includeDriver: true,
    expenseLevel: "متوسط",
    customerName: "",
    customerPhone: ""
  });
  const [isSaving, setIsSaving] = useState(false);
  const [leadId, setLeadId] = useState<string>();

  const destinationTours = data.tours.filter((tour) => tour.destinationId === input.destinationId);
  const destinationTransfers = data.transfers.filter((transfer) => transfer.destinationId === input.destinationId);
  const hotelLevels = Array.from(
    new Set(data.hotelRates.filter((rate) => rate.destinationId === input.destinationId).map((rate) => rate.level))
  ) as HotelLevel[];

  const result = useMemo(() => calculateTrip(input, data), [data, input]);

  function updateDestination(destinationId: string) {
    const nextTransfer = data.transfers.find((item) => item.destinationId === destinationId)?.id;
    const nextHotel = data.hotelRates.find((item) => item.destinationId === destinationId)?.level ?? "4 نجوم";
    setInput((current) => ({
      ...current,
      destinationId,
      hotelLevel: nextHotel,
      selectedTourIds: [],
      transferId: nextTransfer
    }));
    setLeadId(undefined);
  }

  function toggleTour(tourId: string) {
    setInput((current) => {
      const exists = current.selectedTourIds.includes(tourId);
      return {
        ...current,
        selectedTourIds: exists
          ? current.selectedTourIds.filter((id) => id !== tourId)
          : [...current.selectedTourIds, tourId]
      };
    });
    setLeadId(undefined);
  }

  async function saveLead() {
    // التحقق من البيانات قبل الإرسال
    if (!input.destinationId || !result || result.subtotal <= 0) {
      alert("الرجاء إكمال البيانات أولاً (الوجهة وتفاصيل الرحلة)");
      return;
    }

    setIsSaving(true);
    try {
      const bodyData = JSON.stringify({ input, result });

      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: bodyData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `خطأ ${response.status}`);
      }

      const payload = (await response.json()) as LeadResponse;
      setLeadId(payload.leadId);

      if (payload.whatsappUrl) {
        window.open(payload.whatsappUrl, "_blank", "noopener,noreferrer");
      }
    } catch (error) {
      console.error("Save lead error:", error);
      alert(
        error instanceof Error
          ? error.message
          : "حدث خطأ. حاول مرة أخرى."
      );
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <section className="calculator-shell" id="calculator" aria-label="حاسبة تكلفة السفر">
      <div className="calculator-head">
        <div>
          <p className="calc-kicker">عرض تقديري فوري</p>
          <h2>احسب تكلفة الرحلة</h2>
        </div>
        <Sparkles color="#087f7b" aria-hidden="true" />
      </div>

      <div className="form-grid">
        <div className="form-section-title full">
          <CalendarDays size={18} aria-hidden="true" />
          تفاصيل الرحلة
        </div>

        <div className="field field-wide">
          <label htmlFor="destination">الدولة</label>
          <select id="destination" value={input.destinationId} onChange={(event) => updateDestination(event.target.value)}>
            {activeDestinations.map((destination) => (
              <option key={destination.id} value={destination.id}>
                {destination.name}
              </option>
            ))}
          </select>
        </div>

        <div className="field field-wide">
          <label htmlFor="hotel">مستوى الفندق</label>
          <select
            id="hotel"
            value={input.hotelLevel}
            onChange={(event) => setInput({ ...input, hotelLevel: event.target.value as HotelLevel })}
          >
            {hotelLevels.map((level) => (
              <option key={level} value={level}>
                {level}
              </option>
            ))}
          </select>
        </div>

        <div className="field">
          <label htmlFor="date">تاريخ السفر</label>
          <input
            id="date"
            type="date"
            value={input.travelDate}
            onChange={(event) => setInput({ ...input, travelDate: event.target.value })}
          />
        </div>

        <div className="field">
          <label htmlFor="month">أو شهر السفر</label>
          <select
            id="month"
            value={input.travelMonth}
            onChange={(event) => setInput({ ...input, travelMonth: event.target.value })}
          >
            {months.map((month) => (
              <option key={month} value={month}>
                {month}
              </option>
            ))}
          </select>
        </div>

        <div className="field">
          <label htmlFor="nights">عدد الليالي</label>
          <input
            id="nights"
            type="number"
            min={1}
            max={45}
            value={input.nights}
            onChange={(event) => setInput({ ...input, nights: Number(event.target.value) })}
          />
        </div>

        <div className="form-section-title full compact-title">
          <UserRound size={18} aria-hidden="true" />
          المسافرون والخدمات
        </div>

        <div className="field">
          <label htmlFor="adults">البالغون</label>
          <input
            id="adults"
            type="number"
            min={1}
            max={12}
            value={input.adults}
            onChange={(event) => setInput({ ...input, adults: Number(event.target.value) })}
          />
        </div>

        <div className="field">
          <label htmlFor="children">الأطفال</label>
          <input
            id="children"
            type="number"
            min={0}
            max={12}
            value={input.children}
            onChange={(event) => setInput({ ...input, children: Number(event.target.value) })}
          />
        </div>

        <div className="field">
          <label htmlFor="expenses">المصاريف اليومية</label>
          <select
            id="expenses"
            value={input.expenseLevel}
            onChange={(event) => setInput({ ...input, expenseLevel: event.target.value as ExpenseLevel })}
          >
            <option value="اقتصادي">اقتصادي</option>
            <option value="متوسط">متوسط</option>
            <option value="فاخر">فاخر</option>
          </select>
        </div>

        <div className="field">
          <label htmlFor="transfer">الاستقبال والتوديع</label>
          <select
            id="transfer"
            value={input.transferId ?? ""}
            onChange={(event) => setInput({ ...input, transferId: event.target.value || undefined })}
          >
            <option value="">بدون</option>
            {destinationTransfers.map((transfer) => (
              <option key={transfer.id} value={transfer.id}>
                {transfer.service} - {formatSar(transfer.price)}
              </option>
            ))}
          </select>
        </div>

        <div className="field">
          <label htmlFor="name">الاسم</label>
          <input
            id="name"
            type="text"
            placeholder="اختياري"
            value={input.customerName}
            onChange={(event) => setInput({ ...input, customerName: event.target.value })}
          />
        </div>

        <div className="field">
          <label htmlFor="phone">رقم الجوال</label>
          <input
            id="phone"
            type="tel"
            placeholder="اختياري"
            value={input.customerPhone}
            onChange={(event) => setInput({ ...input, customerPhone: event.target.value })}
          />
        </div>

        <div className="form-section-title full compact-title">
          <CarFront size={18} aria-hidden="true" />
          الجولات والسائق
        </div>

        <div className="field full">
          <label>الجولات اليومية</label>
          <div className="check-list">
            {destinationTours.map((tour) => (
              <label key={tour.id} className="check-item">
                <input
                  type="checkbox"
                  checked={input.selectedTourIds.includes(tour.id)}
                  onChange={() => toggleTour(tour.id)}
                />
                <span>
                  {tour.name} - {formatSar(tour.price)}
                </span>
              </label>
            ))}
          </div>
        </div>

        <label className="check-item field full">
          <input
            type="checkbox"
            checked={input.includeDriver}
            onChange={(event) => setInput({ ...input, includeDriver: event.target.checked })}
          />
          <span>إضافة سائق خاص طوال الرحلة عند توفره</span>
        </label>
      </div>

      <div className="result-panel" aria-live="polite">
        <div className="result-top">
          <div>
            <p className="result-label">
              <ReceiptText size={18} aria-hidden="true" />
              ملخص التكلفة
            </p>
            <p className="price-range">
              من {formatSar(result.minTotal)} إلى {formatSar(result.maxTotal)}
            </p>
            <p className="result-note">السعر النهائي حسب التوفر والتاريخ والموسم.</p>
          </div>
          <button className="primary-button" type="button" onClick={saveLead} disabled={isSaving}>
            <MessageCircle size={18} aria-hidden="true" />
            {isSaving ? "جار حفظ الطلب" : "تواصل واتساب"}
          </button>
        </div>

        <div className="breakdown">
          <BreakdownRow label="الفنادق مع الإفطار" value={result.breakdown.hotels} />
          <BreakdownRow label="الجولات السياحية" value={result.breakdown.tours} />
          <BreakdownRow label="الاستقبال والتوديع" value={result.breakdown.transfers} />
          <BreakdownRow label="السائق الخاص" value={result.breakdown.driver} />
          <BreakdownRow label="المصاريف اليومية" value={result.breakdown.dailyExpenses} />
        </div>

        {result.packageMatch ? (
          <div className="package-match">
            <strong>سعر عطلاتكم لهذه الباقة: {formatSar(result.packageMatch.price)}</strong>
            <span>
              {result.packageMatch.name} - {result.packageMatch.notes}
            </span>
          </div>
        ) : null}

        {leadId ? (
          <div className="package-match">
            <strong>تم حفظ الطلب رقم {leadId}</strong>
            <span>يمكن لفريق المبيعات الرجوع للتفاصيل عند التواصل.</span>
          </div>
        ) : null}

        {result.warnings.map((warning) => (
          <div className="package-match" key={warning}>
            <span>{warning}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

function BreakdownRow({ label, value }: { label: string; value: number }) {
  return (
    <div className="breakdown-row">
      <BedDouble size={16} aria-hidden="true" />
      <span>{label}</span>
      <strong>{formatSar(value)}</strong>
    </div>
  );
}
