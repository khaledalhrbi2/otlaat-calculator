import Link from "next/link";
import { Mail, Phone, MapPin, Instagram, Facebook } from "lucide-react";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="container footer-inner">
        <div className="footer-grid">
          {/* العمود الأول: البراند */}
          <div className="footer-brand">
            <Link href="/" className="footer-logo">
              <span className="footer-logo-mark">ع</span>
              <span className="footer-logo-text">عطلات<span>.</span></span>
            </Link>
            <p className="footer-tagline">
              منصة سعودية متخصصة في الباقات السياحية والحجوزات المؤكدة.
              نخطط لرحلتك بالتفصيل ونوفّر لك الوقت والمال.
            </p>
            <div className="footer-social">
              <a href="https://instagram.com/otlaat" aria-label="انستقرام" target="_blank" rel="noopener noreferrer">
                <Instagram size={18} aria-hidden="true" />
              </a>
              <a href="https://facebook.com/otlaat" aria-label="فيسبوك" target="_blank" rel="noopener noreferrer">
                <Facebook size={18} aria-hidden="true" />
              </a>
            </div>
          </div>

          {/* العمود الثاني: روابط سريعة */}
          <div className="footer-col">
            <h4>روابط سريعة</h4>
            <Link href="/destinations">الوجهات</Link>
            <Link href="/packages">الباقات</Link>
            <Link href="/faq">الأسئلة الشائعة</Link>
            <Link href="/about">عن عطلات</Link>
          </div>

          {/* العمود الثالث: تواصل */}
          <div className="footer-col">
            <h4>تواصل معنا</h4>
            <a href="https://wa.me/966500000000" className="footer-contact">
              <Phone size={14} aria-hidden="true" />
              <span dir="ltr">+966 50 000 0000</span>
            </a>
            <a href="mailto:info@otlaat.sa" className="footer-contact">
              <Mail size={14} aria-hidden="true" />
              <span>info@otlaat.sa</span>
            </a>
            <span className="footer-contact">
              <MapPin size={14} aria-hidden="true" />
              <span>جدة، المملكة العربية السعودية</span>
            </span>
          </div>

          {/* العمود الرابع: شارات الثقة */}
          <div className="footer-col">
            <h4>ضمان عطلات</h4>
            <span className="footer-trust">🛡️ مرخّصة من وزارة السياحة</span>
            <span className="footer-trust">💳 دفع آمن عبر Paymob</span>
            <span className="footer-trust">⭐ تقييم 4.9/5 من العملاء</span>
            <span className="footer-trust">🤝 شراكة مع Hotelbeds و RezLive</span>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© {year} عطلات الحجوزات المؤكدة. جميع الحقوق محفوظة.</p>
          <div className="footer-bottom-links">
            <Link href="/privacy">سياسة الخصوصية</Link>
            <Link href="/terms">الشروط والأحكام</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
