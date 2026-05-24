import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Middleware للحماية الأمنية
 * يحمي صفحات /admin و /api/admin من الوصول غير المصرح به
 *
 * الحماية الحالية: Basic HTTP Authentication
 * للإنتاج: استبدله بـ NextAuth.js مع Google OAuth
 *
 * في .env.local لازم تضيف:
 *   ADMIN_USER=your_username
 *   ADMIN_PASS=your_strong_password
 */

const ADMIN_PATHS = ["/admin", "/api/admin"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // تحقق إذا كان المسار محمياً
  const isProtected = ADMIN_PATHS.some((path) => pathname.startsWith(path));

  if (!isProtected) {
    return NextResponse.next();
  }

  // قراءة بيانات الاعتماد من المتغيرات البيئية
  const adminUser = process.env.ADMIN_USER;
  const adminPass = process.env.ADMIN_PASS;

  // حماية ضد إعدادات غير مكتملة - رفض الوصول إذا لم تكن المتغيرات موجودة
  if (!adminUser || !adminPass) {
    return new NextResponse(
      JSON.stringify({
        error: "Admin authentication is not configured",
        message: "ADMIN_USER and ADMIN_PASS must be set in environment variables",
      }),
      {
        status: 503,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  // التحقق من رأس Authorization
  const authHeader = request.headers.get("authorization");

  if (authHeader) {
    const [scheme, credentials] = authHeader.split(" ");

    if (scheme === "Basic" && credentials) {
      try {
        const decoded = atob(credentials);
        const [user, ...passParts] = decoded.split(":");
        const pass = passParts.join(":"); // يدعم كلمات مرور فيها :

        if (user === adminUser && pass === adminPass) {
          // مصادقة ناجحة - السماح بالمرور
          return NextResponse.next();
        }
      } catch {
        // فشل في فك التشفير - رفض
      }
    }
  }

  // طلب المصادقة
  return new NextResponse("الرجاء إدخال بيانات الاعتماد للوصول", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="Otlaat Admin Area"',
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
}

export const config = {
  // matcher: حدد المسارات التي يطبق عليها الـ middleware
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
