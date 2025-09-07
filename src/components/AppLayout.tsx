"use client";
import { useState } from "react";
import { Sidebar, SidebarBody, SidebarLink } from "./ui/Sidebar";
import {
  IconBrandTabler,
  IconSettings,
  IconUserBolt,
  IconHistory,
  IconDeviceDesktop,
} from "@tabler/icons-react";
import { motion } from "motion/react";
import { useNavigation } from "../contexts/NavigationContext";

interface LayoutProps {
  children: React.ReactNode;
}

const links = [
  {
    label: "Dashboard",
    href: "dashboard",
    icon: (
      <IconBrandTabler className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
    ),
  },
  {
    label: "Development",
    href: "development",
    icon: (
      <IconUserBolt className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
    ),
  },
  {
    label: "History",
    href: "history",
    icon: (
      <IconHistory className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
    ),
  },
  {
    label: "Monitoring",
    href: "monitoring",
    icon: (
      <IconDeviceDesktop className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
    ),
  },
  {
    label: "Settings",
    href: "settings",
    icon: (
      <IconSettings className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
    ),
  },
];

export default function AppLayout({ children }: LayoutProps) {
  const [open, setOpen] = useState(false);
  const { navigateTo } = useNavigation();
  
  return (
    <div
      className="flex h-screen w-full flex-col bg-gray-100 md:flex-row dark:bg-neutral-800"
    >
      <Sidebar open={open} setOpen={setOpen}>
        <SidebarBody className="justify-between gap-10">
          <div className="flex flex-1 flex-col overflow-x-hidden overflow-y-auto">
            {open ? <Logo /> : <LogoIcon />}
            <div className="mt-8 flex flex-col gap-2">
              {links.map((link, idx) => (
                <SidebarLink 
                  key={idx} 
                  link={{
                    ...link,
                    onClick: () => navigateTo(link.href as any)
                  }} 
                />
              ))}
            </div>
          </div>
          <div>
            <SidebarLink
              link={{
                label: "Teste",
                href: "#",
                icon: (
                  <img
                    src="src/assets/react.svg"
                    className="h-7 w-7 shrink-0 rounded-full"
                    width={50}
                    height={50}
                    alt="Avatar"
                  />
                ),
              }}
            />
          </div>
        </SidebarBody>
      </Sidebar>
      
      <div className="flex flex-1 overflow-hidden">
        <div className="flex h-full w-full flex-1 flex-col gap-2 overflow-y-auto bg-white p-4 md:p-8 dark:bg-neutral-900 rounded-l-[20px]">
          {children}
        </div>
      </div>
    </div>
  );
}

export const Logo = () => {
  return (
    <a
      href="#"
      className="relative z-20 flex items-center space-x-2 py-1 text-sm font-normal text-black"
    >
      <div className="h-5 w-6 shrink-0 rounded-bl-sm rounded-br-lg rounded-tl-lg rounded-tr-sm bg-black dark:bg-white" />
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="whitespace-pre font-medium text-black dark:text-white"
      >
        Gojira
      </motion.span>
    </a>
  );
};

export const LogoIcon = () => {
  return (
    <a
      href="#"
      className="relative z-20 flex items-center space-x-2 py-1 text-sm font-normal text-black"
    >
      <div className="h-5 w-6 shrink-0 rounded-bl-sm rounded-br-lg rounded-tl-lg rounded-tr-sm bg-black dark:bg-white" />
    </a>
  );
};