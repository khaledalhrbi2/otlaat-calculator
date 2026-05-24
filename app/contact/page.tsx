import { Mail, MessageCircle, Phone } from "lucide-react";

export default function ContactPage() {
  const phone = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "966500000000";

  return (
    <>
      <section className="page-hero">
        <div className="container page-title">
          <h1>التواصل</h1>
          <p>أرسل تفاصيل رحلتك أو استخدم الحاسبة ليصل للفريق طلب مرتب برقم متابعة.</p>
        </div>
      </section>
      <section className="section">
        <div className="container contact-layout">
          <div className="contact-box">
            <h2>قنوات التواصل</h2>
            <div className="contact-list">
              <a className="contact-item" href={`https://wa.me/${phone}`}>
                <MessageCircle color="#087f7b" aria-hidden="true" />
                واتساب: {phone}
              </a>
              <a className="contact-item" href={`tel:+${phone}`}>
                <Phone color="#087f7b" aria-hidden="true" />
                اتصال مباشر
              </a>
              <a className="contact-item" href="mailto:hello@example.com">
                <Mail color="#087f7b" aria-hidden="true" />
                hello@example.com
              </a>
            </div>
          </div>
          <div className="contact-box">
            <h2>ماذا نحتاج منك؟</h2>
            <p>الوجهة، عدد الأشخاص، التواريخ المتوقعة، مستوى الفندق، وهل تفضل سائق خاص أو برنامج يومي كامل.</p>
          </div>
        </div>
      </section>
    </>
  );
}
