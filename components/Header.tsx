"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, MessageCircle } from "lucide-react";

const links = [
  { href: "/", label: "الرئيسية" },
  { href: "/destinations", label: "الوجهات" },
  { href: "/packages", label: "الباقات" },
  { href: "/faq", label: "الأسئلة" },
  { href: "/about", label: "عن عطلات" },
];

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="site-header">
      <nav className="container nav" aria-label="التنقل الرئيسي">
        <Link href="/" className="brand" aria-label="عطلات" onClick={() => setIsOpen(false)}>
          <span className="brand-mark" aria-hidden="true">ع</span>
          <span className="brand-text">عطلات<span className="brand-dot">.</span></span>
        </Link>

        <div className={`nav-links ${isOpen ? "is-open" : ""}`}>
          {links.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={isActive ? "is-active" : ""}
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        <div className="nav-actions">
          <Link className="nav-cta" href="/contact">
            <MessageCircle size={17} aria-hidden="true" />
            <span>تواصل</span>
          </Link>
          <button
            type="button"
            className="nav-toggle"
            aria-label={isOpen ? "إغلاق القائمة" : "فتح القائمة"}
            aria-expanded={isOpen}
            onClick={() => setIsOpen((v) => !v)}
          >
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>
    </header>
  );
}
