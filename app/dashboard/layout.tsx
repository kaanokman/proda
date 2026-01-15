import { EnvVarWarning } from "@/components/env-var-warning";
import { AuthButton } from "@/components/auth-button";
import { hasEnvVars } from "@/lib/utils";
import { Suspense } from "react";
import Sidebar from "@/components/Sidebar";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen flex flex-col">
      <nav className="w-full d-flex align-items-center justify-content-between px-5 bg-primary h-20
      position-fixed z-2">
        <img width="144" height="40" src="https://proda.ai/wp-content/uploads/2023/09/PRODA-logo-light-blue-288x80.png" alt="PRODA logo"></img>
        <div className="w-full flex justify-end items-center text-sm">
          {!hasEnvVars ? (
            <EnvVarWarning />
          ) : (
            <Suspense>
              <AuthButton />
            </Suspense>
          )}
        </div>
      </nav>
      <div className="d-flex flex-column bg-light p-2 border-end h-100 
      z-1 position-fixed"
        style={{ width: "150px", minWidth: "150px", marginTop: 80 }}>
        <Sidebar />
      </div>
      <div style={{ marginLeft: 150, marginTop: 80 }} className="p-2 z-0">
        <div className="flex-col flex-1 gap-3 p-3 me-2">
          {children}
        </div>
      </div>
    </main>
  );
}
