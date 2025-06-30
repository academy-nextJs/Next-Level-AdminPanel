import { useCallback, useEffect, useRef, useState } from "react";
import { TbHomeFilled } from "react-icons/tb";
import { MdNotificationsActive, MdOutlinePayments } from "react-icons/md";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import logo from "./../../../assets/BUTORENT.png";
import { FaHeart, FaPlusCircle } from "react-icons/fa";
import { IoPersonSharp } from "react-icons/io5";
import { BiChevronDown } from "react-icons/bi";
import { BsPcHorizontal } from "react-icons/bs";
import { useSidebar } from "../context/SidebarContext";
import WalletCard from "../components/Sidebar/WalletCard";
import { Tooltip } from "@heroui/react";

type NavItem = {
  name: string;
  icon: React.ReactNode;
  path?: string;
  subItems?: { name: string; path: string; pro?: boolean; new?: boolean }[];
};

const navItems: NavItem[] = [
  {
    icon: <TbHomeFilled />,
    name: "داشبورد",
    path: "/buyer/dashboard",
  },

  {
    icon: <IoPersonSharp />,
    name: "اطلاعات کاربری",
    path: "/buyer/profile",
  },

  {
    name: "مدیریت رزرو ها",
    icon: <FaPlusCircle />,
    path: "/buyer/booking-management",
  },
  {
    name: "علاقه مندی ها",
    icon: <FaHeart />,
    path: "/buyer/favorites",
  },
  {
    name: "پرداخت ها",
    icon: <MdOutlinePayments />,
    path: "/buyer/payments",
  },
  {
    name: "اعلان ها",
    icon: <MdNotificationsActive />,
    path: "/buyer/announcements",
  },
];

const AppSidebar: React.FC = () => {
  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
  const pathname = usePathname();

  const [openSubmenu, setOpenSubmenu] = useState<{
    type: "main";
    index: number;
  } | null>(null);
  const [subMenuHeight, setSubMenuHeight] = useState<Record<string, number>>(
    {}
  );
  const subMenuRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const isActive = useCallback((path: string) => pathname === path, [pathname]);

  useEffect(() => {
    let submenuMatched = false;
    ["main"].forEach((menuType) => {
      const items = menuType === "main" ? navItems : [];
      items.forEach((nav: NavItem, index: number) => {
        if (nav.subItems) {
          nav.subItems.forEach((subItem) => {
            if (isActive(subItem.path)) {
              setOpenSubmenu({
                type: menuType as "main",
                index,
              });
              submenuMatched = true;
            }
          });
        }
      });
    });

    if (!submenuMatched) {
      setOpenSubmenu(null);
    }
  }, [isActive]);

  useEffect(() => {
    if (openSubmenu !== null) {
      const key = `${openSubmenu.type}-${openSubmenu.index}`;
      if (subMenuRefs.current[key]) {
        setSubMenuHeight((prevHeights) => ({
          ...prevHeights,
          [key]: subMenuRefs.current[key]?.scrollHeight || 0,
        }));
      }
    }
  }, [openSubmenu]);

  const handleSubmenuToggle = (index: number, menuType: "main") => {
    setOpenSubmenu((prevOpenSubmenu) => {
      if (
        prevOpenSubmenu &&
        prevOpenSubmenu.type === menuType &&
        prevOpenSubmenu.index === index
      ) {
        return null;
      }
      return { type: menuType, index };
    });
  };

  const renderMenuItems = (items: NavItem[], menuType: "main") => (
    <ul className="flex flex-col gap-4">
      {items.map((nav, index) => (
        <li key={nav.name}>
          {nav.subItems ? (
            <Tooltip
              content={nav.name}
              placement="left"
              color="warning"
              isDisabled={isExpanded || isMobileOpen}
              showArrow={true}
              className="rounded-lg"
            >
              <button
                onClick={() => handleSubmenuToggle(index, menuType)}
                className={`menu-item group flex items-center px-4 py-3 rounded-lg ${
                  openSubmenu?.type === menuType && openSubmenu?.index === index
                    ? "menu-item-active"
                    : "menu-item-inactive"
                } cursor-pointer ${
                  !isExpanded ? "lg:justify-center" : "lg:justify-start"
                }`}
              >
                <span
                  className={`menu-item-icon-size flex items-center justify-center text-2xl ${
                    openSubmenu?.type === menuType &&
                    openSubmenu?.index === index
                      ? "menu-item-icon-active"
                      : "menu-item-icon-inactive text-gray-500 dark:text-white"
                  }`}
                >
                  {nav.icon}
                </span>
                {(isExpanded || isMobileOpen) && (
                  <span className="menu-item-text text-lg mr-3">
                    {nav.name}
                  </span>
                )}
                {(isExpanded || isMobileOpen) && (
                  <BiChevronDown
                    className={`mr-auto w-6 h-6 transition-transform duration-200 ${
                      openSubmenu?.type === menuType &&
                      openSubmenu?.index === index
                        ? "rotate-180 text-brand-500"
                        : ""
                    }`}
                  />
                )}
              </button>
            </Tooltip>
          ) : (
            nav.path && (
              <Tooltip
                content={nav.name}
                placement="left"
                color="warning"
                isDisabled={isExpanded || isMobileOpen}
                showArrow={true}
                className="rounded-lg"
              >
                <Link
                  href={nav.path}
                  className={`menu-item group flex items-center px-4 py-3 rounded-lg ${
                    isActive(nav.path)
                      ? "menu-item-active"
                      : "menu-item-inactive"
                  } ${!isExpanded ? "lg:justify-center" : "lg:justify-start"}`}
                >
                  <span
                    className={`menu-item-icon-size flex items-center justify-center text-2xl ${
                      isActive(nav.path)
                        ? "menu-item-icon-active"
                        : "menu-item-icon-inactive text-gray-500 dark:text-white"
                    }`}
                  >
                    {nav.icon}
                  </span>
                  {(isExpanded || isMobileOpen) && (
                    <span className="menu-item-text text-medium  mr-3">
                      {nav.name}
                    </span>
                  )}
                </Link>
              </Tooltip>
            )
          )}
          {nav.subItems && (isExpanded || isMobileOpen) && (
            <div
              ref={(el) => {
                subMenuRefs.current[`${menuType}-${index}`] = el;
              }}
              className="overflow-hidden transition-all duration-300"
              style={{
                height:
                  openSubmenu?.type === menuType && openSubmenu?.index === index
                    ? `${subMenuHeight[`${menuType}-${index}`]}px`
                    : "0px",
              }}
            >
              <ul className="mt-2 space-y-1 mr-9">
                {nav.subItems.map((subItem) => (
                  <li key={subItem.name}>
                    <Link
                      href={subItem.path}
                      className={`menu-dropdown-item text-base px-4 py-2 ${
                        isActive(subItem.path)
                          ? "menu-dropdown-item-active"
                          : "menu-dropdown-item-inactive"
                      }`}
                    >
                      {subItem.name}
                      <span className="flex items-center gap-1 mr-auto">
                        {subItem.new && (
                          <span
                            className={`mr-auto ${
                              isActive(subItem.path)
                                ? "menu-dropdown-badge-active"
                                : "menu-dropdown-badge-inactive"
                            } menu-dropdown-badge`}
                          >
                            new
                          </span>
                        )}
                        {subItem.pro && (
                          <span
                            className={`mr-auto ${
                              isActive(subItem.path)
                                ? "menu-dropdown-badge-active"
                                : "menu-dropdown-badge-inactive"
                            } menu-dropdown-badge`}
                          >
                            pro
                          </span>
                        )}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </li>
      ))}
    </ul>
  );

  return (
    <aside
      className={`fixed flex flex-col lg:mt-0 top-0 px-2 right-0 bg-white dark:bg-gray-900 dark:border-gray-800 text-gray-900 h-screen transition-all duration-300 ease-in-out z-50 border-l border-gray-200 
        ${
          isExpanded || isMobileOpen
            ? "w-[320px]"
            : isHovered
            ? "w-[320px]"
            : "w-[110px]"
        }
        ${
          isMobileOpen ? "translate-x-0" : "translate-x-full lg:translate-x-0"
        }`}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={`py-8 flex  ${
          !isExpanded && !isHovered ? "lg:justify-center" : "justify-center "
        }`}
      >
        <Link href="/" className="flex items-center gap-1">
          {isExpanded || isHovered || isMobileOpen ? (
            <>
              <Image
                className="dark:hidden h-auto w-auto  "
                src={logo}
                alt="Logo"
                width={70}
              />
              <Image
                className="hidden dark:block h-auto w-auto"
                src={logo}
                alt="Logo"
                width={70}
              />
              <h1 className="text-4xl font-extrabold mt-1 text-neutral-900 tracking-tight leading-none">
                <span className="dark:text-emerald-400 bg-gradient-to-r from-neutral-900 via-neutral-700 to-neutral-900 bg-clip-text text-black drop-shadow-sm">
                  B
                </span>
                <span className="text-[#fca804] dark:text-amber-400 drop-shadow-sm">
                  UYO
                  <span className="text-black dark:text-emerald-400">R</span>
                  ENT
                </span>
              </h1>
            </>
          ) : (
            <Image src={logo} alt="Logo" className="h-auto w-auto" width={32} />
          )}
        </Link>
      </div>
      <div className="flex flex-col overflow-y-auto duration-300 ease-linear no-scrollbar">
        <nav className="mb-6">
          <div className="flex flex-col gap-4">
            <div>
              <h2
                className={`mb-4 text-sm uppercase flex leading-[20px] text-gray-400 ${
                  !isExpanded && !isHovered
                    ? "lg:justify-center"
                    : "justify-start"
                }`}
              >
                {isExpanded || isHovered || isMobileOpen ? (
                  "منو"
                ) : (
                  <BsPcHorizontal className="size-6" />
                )}
              </h2>
              {renderMenuItems(navItems, "main")}
            </div>
            <div className="">
              <h2
                className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${
                  !isExpanded && !isHovered
                    ? "lg:justify-center"
                    : "justify-start"
                }`}
              ></h2>
            </div>
          </div>
        </nav>
      </div>
      <WalletCard />
    </aside>
  );
};

export default AppSidebar;
