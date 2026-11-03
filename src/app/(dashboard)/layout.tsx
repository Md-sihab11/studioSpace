import React from "react";
import DashboardLayoutShell from "@/component/dashboard/DashboardLayoutShell";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
    return <DashboardLayoutShell>{children}</DashboardLayoutShell>;
};

export default DashboardLayout;
