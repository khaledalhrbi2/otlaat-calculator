import Image from "next/image";
import { MapPin } from "lucide-react";
import { getTravelData } from "@/lib/data";

export default async function DestinationsPage() {
  const data = await getTravelData();
  const destinations = data.destinations.filter((item) => item.status === "active");

  return (
    <>
      <section className="page-hero">
        <div className="container page-title">
          <h1>الوجهات</h1>
          <p>صفحات مختصرة لكل دولة، مبنية من بيانات قابلة للتعديل من Google Sheets.</p>
        </div>
      </section>
      <section className="section">
        <div className="container destination-grid">
          {destinations.map((destination) => (
            <article className="destination-card" key={destination.id}>
              <Image src={destination.imageUrl} alt={destination.name} width={900} height={520} />
              <div className="card-body">
                <h3>{destination.name}</h3>
                <p>{destination.description}</p>
                <div className="meta-line">
                  <span className="pill">
                    <MapPin size={14} aria-hidden="true" />
                    وجهة نشطة
                  </span>
                  <span className="pill">تحويل {destination.sarRate} ريال</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
