"use client";

import { sidebarLinks } from "@/constants";
import { LucideIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

function LeftSidebar() {
  const pathname = usePathname();

  if (pathname === "/sign-in") return null;
  return (
    <section className="custom-scrollbar leftsidebar">
      <div className="flex w-full flex-1 flex-col gap-2 px-3">
        {sidebarLinks.map((link) => {
          const isActive = (pathname.includes(link.route) && link.route.length > 1) || pathname === link.route;
          const Icon: LucideIcon = link.icon;

          return (
            <Link
              href={link.route}
              key={link.label}
              className={`leftsidebar_link font-medium border-b-[3px] border-transparent ${
                isActive && "!font-bold !border-gray-800"
              } hover:border-gray-500`}
            >
              <Icon className={`h-5 w-5 opacity-70 ${isActive && "!opacity-100"}`} />
              <p className={`text-dark-3 max-lg:hidden`}>{link.label}</p>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

export default LeftSidebar;
