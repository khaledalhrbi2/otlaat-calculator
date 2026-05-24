import { NextResponse } from "next/server";
import type { CalculatorInput, CalculatorResult } from "@/lib/types";
import { formatSar } from "@/lib/calculator";

type LeadPayload = {
  input: CalculatorInput;
  result: CalculatorResult;
};

const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "966500000000";
const LEADS_WEBHOOK_URL = process.env.GOOGLE_SHEETS_LEADS_WEBHOOK_URL;

/**
 * Rate Limiting بسيط في الذاكرة
 * للإنتاج الجاد: استخدم Vercel KV أو Upstash Redis
 */
const RATE_LIMIT_WINDOW_MS = 60_000; // دقيقة واحدة
const RATE_LIMIT_MAX_REQUESTS = 5; // 5 طلبات لكل IP في الدقيقة
const requestLog = new Map<string, number[]>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const timestamps = requestLog.get(ip) || [];

  // نظّف الطلبات القديمة
  const recent = timestamps.filter((t) => now - t < RATE_LIMIT_WINDOW_MS);

  if (recent.length >= RATE_LIMIT_MAX_REQUESTS) {
    requestLog.set(ip, recent);
    return true;
  }

  recent.push(now);
  requestLog.set(ip, recent);

  // تنظيف دوري للذاكرة (كل 100 طلب)
  if (requestLog.size > 1000) {
    const keysToCheck = Array.from(requestLog.keys());
    keysToCheck.forEach((key) => {
      const times = requestLog.get(key) || [];
      const recentTimes = times.filter((t: number) => now - t < RATE_LIMIT_WINDOW_MS);
      if (recentTimes.length === 0) {
        requestLog.delete(key);
      } else {
        requestLog.set(key, recentTimes);
      }
    });
  }

  return false;
}

function getClientIp(request: Request): string {
  // ترتيب الأفضلية لاكتشاف الـ IP الحقيقي
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();

  const realIp = request.headers.get("x-real-ip");
  if (realIp) return realIp;

  return "unknown";
}

function validateLeadPayload(payload: unknown): payload is LeadPayload {
  if (!payload || typeof payload !== "object") return false;
  const p = payload as Record<string, unknown>;
  return (
    typeof p.input === "object" &&
    p.input !== null &&
    typeof p.result === "object" &&
    p.result !== null
  );
}

export async function POST(request: Request) {
  // 1. Rate limiting
  const ip = getClientIp(request);
  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: "تجاوزت الحد المسموح. حاول مرة أخرى بعد دقيقة." },
      { status: 429 }
    );
  }

  try {
    // 2. تحليل البيانات
    const payload = await request.json();

    // 3. التحقق من الصحة
    if (!validateLeadPayload(payload)) {
      return NextResponse.json(
        { error: "بيانات غير صحيحة" },
        { status: 400 }
      );
    }

    const leadId = createLeadId();

    const leadRecord = {
      leadId,
      createdAt: new Date().toISOString(),
      input: payload.input,
      result: payload.result,
      status: "new",
      source: "calculator",
      ip,
    };

    // 4. إرسال للـ webhook (Google Sheets / Pipedrive)
    if (LEADS_WEBHOOK_URL) {
      try {
        await fetch(LEADS_WEBHOOK_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(leadRecord),
        });
      } catch (error) {
        console.error("Webhook error (non-fatal):", error);
        // نكمل حتى لو فشل الـ webhook - تجربة المستخدم أهم
      }
    }

    const whatsappUrl = buildWhatsappUrl(leadId, payload);
    return NextResponse.json({ leadId, whatsappUrl });
  } catch (error) {
    console.error("Lead creation error:", error);
    return NextResponse.json(
      { error: "حدث خطأ. الرجاء المحاولة مرة أخرى." },
      { status: 500 }
    );
  }
}

function createLeadId() {
  const stamp = new Date().toISOString().slice(0, 10).replaceAll("-", "");
  const random = Math.random().toString(36).slice(2, 7).toUpperCase();
  return `OTL-${stamp}-${random}`;
}

function buildWhatsappUrl(leadId: string, payload: LeadPayload) {
  const { input, result } = payload;
  const packageLine = result.packageMatch
    ? `\nسعر باقة عطلات: ${formatSar(result.packageMatch.price)} - ${result.packageMatch.name}`
    : "";
  const dateLine = input.travelDate
    ? `تاريخ السفر: ${input.travelDate}`
    : `شهر السفر: ${input.travelMonth}`;

  const message = [
    `السلام عليكم، عندي طلب سفر رقم ${leadId}`,
    `الوجهة: ${result.destinationName}`,
    dateLine,
    `عدد المسافرين: ${result.persons}`,
    `عدد الليالي: ${input.nights}`,
    `مستوى الفندق: ${input.hotelLevel}`,
    `التكلفة التقديرية: من ${formatSar(result.minTotal)} إلى ${formatSar(result.maxTotal)}${packageLine}`,
    "أرغب بتأكيد التوفر والسعر النهائي.",
  ].join("\n");

  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}
