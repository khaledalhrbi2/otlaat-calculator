import { getTravelData } from "@/lib/data";

export default async function FAQPage() {
  const data = await getTravelData();

  return (
    <>
      <section className="page-hero">
        <div className="container page-title">
          <h1>الأسئلة الشائعة</h1>
          <p>إجابات مختصرة تساعد العميل قبل فتح المحادثة.</p>
        </div>
      </section>
      <section className="section">
        <div className="container faq-grid">
          {data.faqs.map((faq) => (
            <article className="faq-card" key={faq.question}>
              <h3>{faq.question}</h3>
              <p>{faq.answer}</p>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
