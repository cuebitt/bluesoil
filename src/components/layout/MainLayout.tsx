import { AppHeader } from "./AppHeader";

export function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen flex-col">
      <AppHeader />
      <div className="flex flex-1 overflow-x-auto overflow-y-hidden">
        <div className="flex min-h-0 min-w-[920px] flex-1">
          {children}
        </div>
      </div>
    </div>
  );
}
