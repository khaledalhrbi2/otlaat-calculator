import { CalendarDays } from "lucide-react";
import { formatSar } from "@/lib/calculator";
import { getTravelData } from "@/lib/data";

export default async function PackagesPage() {
  const data = await getTravelData();
  const packages = data.packages.filter((item) => item.status === "available");

  return (
    <>
      <section className="page-hero">
        <div className="container page-title">
          <h1>باقات عطلاتكم</h1>
          <p>هذه الباقات تظهر داخل الحاسبة عندما تتوافق مع الوجهة وعدد الليالي والأشخاص ومستوى الفندق.</p>
        </div>
      </section>
      <section className="section">
        <div className="container package-grid">
          {packages.map((item) => {
            const destination = data.destinations.find((destinationItem) => destinationItem.id === item.destinationId);
            return (
              <article className="package-card" key={item.id}>
                <p className="eyebrow" style={{ color: "#087f7b" }}>
                  <CalendarDays size={16} aria-hidden="true" />
                  {item.nights} ليال
                </p>
                <h3>{item.name}</h3>
                <p>{destination?.name} - {item.hotelLevel} - {item.persons} أشخاص</p>
                <p>{item.notes}</p>
                <div className="meta-line">
                  <span className="pill">{formatSar(item.price)}</span>
                  <span className="pill">متاحة</span>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </>
  );
}
