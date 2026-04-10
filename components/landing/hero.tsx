import Image from "next/image";
import { ThemeToggle } from "@/components/theme-toggle";

export default function Hero() {
  return (
    <>
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <h1 className="text-(--text-main) " >
        Your Hub for <span className="text-(--accent)">Microsoft</span> Solutions & Expert Support
      </h1>
    </>
  );
}
