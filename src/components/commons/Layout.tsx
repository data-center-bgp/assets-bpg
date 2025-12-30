import React from "react";
import Sidebar from "../commons/Sidebar";
import { useThemeClasses } from "../../hooks/useThemeClasses";

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const { classes } = useThemeClasses();

  return (
    <div className={`flex h-screen ${classes.bg.primary}`}>
      <Sidebar />
      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  );
};

export default MainLayout;
