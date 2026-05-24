import Link from "next/link";
import Image from "next/image";
import {
  CalendarDays,
  CheckCircle2,
  MapPin,
  MessageCircle,
  PlaneTakeoff,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { TravelCalculator } from "@/components/TravelCalculator";
import { formatSar } from "@/lib/calculator";
import { getTravelData } from "@/lib/data";

export default async function HomePage() {
  const data = await getTravelData();
  const activeDestinations = data.destinations.filter(
    (item) => item.status === "active"
  );
  const availablePackages = data.packages
    .filter((item) => item.status === "available")
    .slice(0, 3);

  return (
    <>
      <section className="hero">
        <div className="container hero-grid">
          <div className="hero-copy">
            <p className="eyebrow">
              <Sparkles size={16} aria-hidden="true" />
              حاسبة عطلات الذكية
            </p>
            <h1>
              احسب تكلفة <em>رحلتك القادمة</em> في أقل من دقيقة
            </h1>
            <p>
              واجهة بسيطة تعطيك تكلفة تقديرية واضحة، تقارنها بباقات عطلات
              الجاهزة، ثم تحفظ طلبك وترسله مباشرة لفريق المبيعات على واتساب.
            </p>
            <div className="hero-actions">
              <a className="primary-button" href="#calculator">
                <PlaneTakeoff size={18} aria-hidden="true" />
                ابدأ الحسبة
              </a>
              <Link className="secondary-button" href="/packages">
                عرض الباقات
              </Link>
            </div>
            <div className="hero-stats">
              <div className="stat">
                <strong>{activeDestinations.length}+</strong>
                <span>وجهات</span>
              </div>
              <div className="stat">
                <strong>{availablePackages.length}+</strong>
                <span>باقات جاهزة</span>
              </div>
              <div className="stat">
                <strong>24/7</strong>
                <span>دعم واتساب</span>
              </div>
            </div>
          </div>
          <TravelCalculator data={data} />
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head">
            <div>
              <p className="section-kicker">الوجهات</p>
              <h2>ابدأ من الوجهة التي تحلم بها</h2>
              <p>
                كل وجهة لها أسعار فنادق وجولات وسائق ومصاريف يومية محدّثة وقابلة
                للتعديل من لوحة التحكم.
              </p>
            </div>
            <Link className="secondary-button" href="/destinations">
              عرض كل الوجهات
            </Link>
          </div>
          <div className="destination-grid">
            {activeDestinations.slice(0, 3).map((destination) => (
              <article className="destination-card" key={destination.id}>
                <Image
                  src={destination.imageUrl}
                  alt={destination.name}
                  width={900}
                  height={520}
                />
                <div className="card-body">
                  <h3>{destination.name}</h3>
                  <p>{destination.description}</p>
                  <div className="meta-line">
                    <span className="pill">
                      <MapPin size={12} aria-hidden="true" />
                      نشطة
                    </span>
                    <span className="pill">{destination.sourceCurrency}</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section alt">
        <div className="container">
          <div className="section-head">
            <div>
              <p className="section-kicker">الباقات</p>
              <h2>سعر عطلات النهائي يظهر عند التطابق</h2>
              <p>
                الباقة المناسبة تظهر داخل الحاسبة مباشرة عندما تطابق اختياراتك.
              </p>
            </div>
            <Link className="secondary-button" href="/packages">
              كل الباقات
            </Link>
          </div>
          <div className="package-grid">
            {availablePackages.map((item) => {
              const destination = data.destinations.find(
                (destinationItem) => destinationItem.id === item.destinationId
              );
              return (
                <article className="package-card" key={item.id}>
                  <p className="eyebrow">
                    <CalendarDays size={14} aria-hidden="true" />
                    {item.nights} ليالي
                  </p>
                  <h3>{item.name}</h3>
                  <p>
                    {destination?.name} • {item.hotelLevel} • لشخصين
                  </p>
                  <div className="meta-line">
                    <span className="pill">{formatSar(item.price)}</span>
                    <span className="pill">متاحة</span>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container feature-grid">
          <article className="feature-card">
            <CheckCircle2 aria-hidden="true" />
            <h3>تفصيل واضح</h3>
            <p>
              الفنادق والجولات والسائق والمصاريف اليومية تظهر كبنود منفصلة لتعرف
              بالضبط أين يذهب كل ريال.
            </p>
          </article>
          <article className="feature-card">
            <ShieldCheck aria-hidden="true" />
            <h3>سعر تقديري آمن</h3>
            <p>
              النطاق السعري يقلل الالتباس لأن التوفر والمواسم تتغير باستمرار،
              والسعر النهائي يثبت عند التأكيد.
            </p>
          </article>
          <article className="feature-card">
            <MessageCircle aria-hidden="true" />
            <h3>واتساب برقم طلب</h3>
            <p>
              نحفظ طلبك تلقائياً ونفتح واتساب برسالة جاهزة لفريق المبيعات لأسرع
              رد ممكن.
            </p>
          </article>
        </div>
      </section>
    </>
  );
}
