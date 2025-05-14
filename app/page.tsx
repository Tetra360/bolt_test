import { Header } from "@/components/header";
import { MainLayout } from "@/components/main-layout";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <MainLayout />
    </div>
  );
}