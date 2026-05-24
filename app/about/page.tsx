import { CheckCircle2 } from "lucide-react";

export default function AboutPage() {
  return (
    <>
      <section className="page-hero">
        <div className="container page-title">
          <h1>من نحن</h1>
          <p>عطلاتكم تساعد العميل على فهم ميزانية الرحلة قبل التواصل، ثم يتولى الفريق تأكيد التوفر والسعر النهائي.</p>
        </div>
      </section>
      <section className="section">
        <div className="container feature-grid">
          <article className="feature-card">
            <CheckCircle2 color="#087f7b" aria-hidden="true" />
            <h3>وضوح قبل البيع</h3>
            <p>نحول سؤال “كم تكلف؟” إلى تقدير منظم ومفهوم.</p>
          </article>
          <article className="feature-card">
            <CheckCircle2 color="#087f7b" aria-hidden="true" />
            <h3>بيانات قابلة للتحديث</h3>
            <p>الأسعار والوجهات والباقات تدار من Google Sheets في النسخة الأولى.</p>
          </article>
          <article className="feature-card">
            <CheckCircle2 color="#087f7b" aria-hidden="true" />
            <h3>انتقال سريع للمبيعات</h3>
            <p>كل طلب واتساب يحمل رقم طلب وملخصا واضحا للمتابعة.</p>
          </article>
        </div>
      </section>
    </>
  );
}
