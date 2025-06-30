"use client";

import { usePathname } from "next/navigation";
import { Breadcrumbs as HeroBreadcrumbs, BreadcrumbItem } from "@heroui/react";
import Link from "next/link";
import { MdKeyboardDoubleArrowRight } from "react-icons/md";

const routeMap: { [key: string]: string } = {
  dashboard: "داشبورد",
  profile: "پروفایل",
  payments: "پرداخت‌ها",
  favorites: "علاقه‌مندی‌ها",
  "booking-management": "مدیریت رزرو",
  announcements: "اعلان‌ها",
};

export default function BuyerBreadcrumbs() {
  const pathname = usePathname();
  const paths = pathname.split("/").filter(Boolean);

  const buyerIndex = paths.indexOf("buyer");
  if (buyerIndex !== -1) {
    paths.splice(buyerIndex, 1);
  }

  return (
    <HeroBreadcrumbs
      className="!pl-0 !pr-0 !pb-4 !pt-0"
      separator={<MdKeyboardDoubleArrowRight size={20} />}
      size="lg"
      color="foreground"
      variant="solid"
      underline="hover"
    >
      <BreadcrumbItem>
        <Link href="/buyer/dashboard">خانه</Link>
      </BreadcrumbItem>
      {paths.map((path, index) => {
        const href = `/${paths.slice(0, index + 1).join("/")}`;
        const label = routeMap[path] || path;

        return (
          <BreadcrumbItem key={path}>
            {index === paths.length - 1 ? (
              label
            ) : (
              <Link href={href}>{label}</Link>
            )}
          </BreadcrumbItem>
        );
      })}
    </HeroBreadcrumbs>
  );
}
