import { LabShell } from "@/components/lab/LabShell";
import { Header }   from "@/components/layout/Header";

export const metadata = {
  title: "Lab | Image Play Lab",
  description: "Interactive image processing experiments with real algorithms.",
};

export default function LabPage() {
  return (
    <div className="min-h-screen md:h-screen flex flex-col bg-night-800 md:overflow-hidden">
      <Header lab />
      <LabShell />
    </div>
  );
}
