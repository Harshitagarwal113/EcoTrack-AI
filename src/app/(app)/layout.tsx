import { Sidebar } from "@/components/layout/sidebar";

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Sidebar />
      <div className="flex-1 md:ml-[310px] min-h-screen pb-20 md:pb-8 flex flex-col">
        {children}
      </div>
    </>
  );
}
