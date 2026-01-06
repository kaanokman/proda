import { EnvVarWarning } from "@/components/env-var-warning";
import { AuthButton } from "@/components/auth-button";
import { hasEnvVars } from "@/lib/utils";
import { Suspense } from "react";
import DashboardButton from "@/components/dashboard-button";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center bg-white">
      <div className="flex-1 w-full flex flex-col gap-20 items-center">
        <nav className="w-full flex justify-center bg-primary h-20">
          <div className="w-full max-w-5xl flex justify-between items-center p-3 px-5 text-sm">
            <div className="flex gap-5 items-center font-semibold">
            </div>
            {!hasEnvVars ? (
              <EnvVarWarning />
            ) : (
              <Suspense>
                <AuthButton />
              </Suspense>
            )}
          </div>
        </nav>
        <div className="flex-1 d-flex align-items-center gap-0 max-w-5xl p-5">
          <main className="flex flex-col gap-6 px-4">
            <div className="text-3xl font-semibold text-primary">
              Kaan's Throxy Project
            </div>
            <DashboardButton />
          </main>
        </div>
        <footer className="w-full flex items-center justify-center bg-primary mx-auto text-center text-xs gap-8 py-16">
        </footer>
      </div>
    </main>
  );
}
