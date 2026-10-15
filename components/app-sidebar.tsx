"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { ThemeToggle } from "@/components/theme-toggle";

const sidebarGroups = [
  {
    label: "Main Menu",
    links: [
      { href: "/dashboard", label: "Dashboard", icon: "dashboard" },
      { href: "/hospitals", label: "Hospitals", icon: "local_hospital" },
      { href: "/hospitals?tab=doctors", label: "Doctors", icon: "badge" },
      { href: "/clinics", label: "Clinics", icon: "apartment" },
    ],
  },
  {
    label: "AI & Tools",
    links: [
      { href: "/ai-services", label: "AI Services", icon: "smart_toy" },
      { href: "/prescription-analyzer", label: "Prescription", icon: "description" },
      { href: "/food-analyzer", label: "Food Analysis", icon: "restaurant" },
      { href: "/medicine-identifier", label: "Medicines", icon: "medication" },
      { href: "/report-analyzer", label: "Report Analyzer", icon: "lab_profile" },
      { href: "/health-tools", label: "Health Tools", icon: "monitor_weight" },
    ],
  },
  {
    label: "Connect",
    links: [
      { href: "/chatbot", label: "AI Assistant", icon: "robot_2" },
      { href: "/emergency", label: "Emergency", icon: "emergency" },
    ],
  },
  {
    label: "General",
    links: [
      { href: "/search", label: "Search", icon: "search" },
      { href: "/about", label: "About", icon: "info" },
    ],
  },
];

interface AppSidebarProps {
  open: boolean;
  onClose: () => void;
}

export function AppSidebar({ open, onClose }: AppSidebarProps) {
  const pathname = usePathname();

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  return (
    <>
      <div
        className={`sidebar-backdrop ${open ? "open" : ""}`}
        onClick={onClose}
        aria-hidden="true"
      />
      <aside className={`app-sidebar ${open ? "open" : ""}`} id="app-sidebar">
        <nav className="sidebar-scroll">
          {sidebarGroups.map((group) => (
            <div key={group.label} className="sidebar-group">
              <div className="sidebar-group-label">{group.label}</div>
              {group.links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`sidebar-link ${
                    pathname === link.href ? "active" : ""
                  }`}
                  onClick={onClose}
                >
                  <span className="material-symbols-outlined">{link.icon}</span>
                  <span className="label">{link.label}</span>
                </Link>
              ))}
            </div>
          ))}
          <div className="sidebar-footer">
            <span className="theme-label">
              <span className="material-symbols-outlined" style={{ fontSize: 20 }}>
                dark_mode
              </span>
              Dark Mode
            </span>
            <ThemeToggle />
          </div>
        </nav>
      </aside>
    </>
  );
}
