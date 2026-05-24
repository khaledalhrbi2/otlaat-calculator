import { NextResponse } from "next/server";
import { getTravelData, saveLocalTravelData } from "@/lib/data";
import type { TravelData } from "@/lib/types";

export const dynamic = "force-dynamic";

/**
 * طبقة حماية إضافية (Defense in Depth)
 * حتى لو فشل middleware لأي سبب، الـ API نفسه يتحقق من المصادقة
 */
function isAuthorized(request: Request): boolean {
  const adminUser = process.env.ADMIN_USER;
  const adminPass = process.env.ADMIN_PASS;

  if (!adminUser || !adminPass) return false;

  const authHeader = request.headers.get("authorization");
  if (!authHeader) return false;

  const [scheme, credentials] = authHeader.split(" ");
  if (scheme !== "Basic" || !credentials) return false;

  try {
    const decoded = atob(credentials);
    const [user, ...passParts] = decoded.split(":");
    const pass = passParts.join(":");
    return user === adminUser && pass === adminPass;
  } catch {
    return false;
  }
}

/**
 * التحقق من صحة بنية البيانات قبل الحفظ
 * منع كتابة بيانات مشوهة قد تكسر التطبيق
 */
function validateTravelData(data: unknown): data is TravelData {
  if (!data || typeof data !== "object") return false;
  const d = data as Record<string, unknown>;

  const requiredArrays = [
    "destinations",
    "hotelRates",
    "tours",
    "transfers",
    "drivers",
    "dailyExpenses",
    "packages",
    "faqs",
  ];

  return requiredArrays.every((key) => Array.isArray(d[key]));
}

export async function GET(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const data = await getTravelData();
  return NextResponse.json(data);
}

export async function POST(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const data = await request.json();

    // التحقق من صحة البيانات
    if (!validateTravelData(data)) {
      return NextResponse.json(
        { error: "Invalid data structure", ok: false },
        { status: 400 }
      );
    }

    await saveLocalTravelData(data);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Admin save error:", error);
    return NextResponse.json(
      { error: "Failed to save data", ok: false },
      { status: 500 }
    );
  }
}
