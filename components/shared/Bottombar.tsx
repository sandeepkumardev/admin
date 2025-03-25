"use client";

import Image from "next/legacy/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { sidebarLinks } from "@/constants";
import { LucideIcon } from "lucide-react";

function Bottombar() {
  const pathname = usePathname();

  if (pathname === "/sign-in") return null;
  return (
    <section className="bottombar">
      <div className="bottombar_container">
        {sidebarLinks.map((link) => {
          const isActive = (pathname.includes(link.route) && link.route.length > 1) || pathname === link.route;
          const Icon: LucideIcon = link.icon;

          return (
            <Link
              href={link.route}
              key={link.label}
              className={`bottombar_link font-medium border-b-[3px] border-transparent ${
                isActive && "!font-bold !border-gray-800"
              }`}
            >
              <Icon className={`h-5 w-5 opacity-70 ${isActive && "!opacity-100"}`} />
              <p className="text-dark-3 max-sm:hidden">{link.label.split(/\s+/)[0]}</p>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

export default Bottombar;
