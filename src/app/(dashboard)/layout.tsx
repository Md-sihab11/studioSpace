import React from "react";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="mx-auto w-full max-w-7xl flex-1 px-4 py-12 sm:px-6 lg:px-10">
            {children}
        </div>
    );
};

export default DashboardLayout;
