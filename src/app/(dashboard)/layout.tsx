import React from "react";
import RequireAuth from "@/component/auth/RequireAuth";
import DashboardLayoutShell from "@/component/dashboard/DashboardLayoutShell";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <RequireAuth>
            <DashboardLayoutShell>{children}</DashboardLayoutShell>
        </RequireAuth>
    );
};

export default DashboardLayout;
