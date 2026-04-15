import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="fixed top-0 left-0 w-full z-[9999]">
              <Navbar />
            </div>
      {children}
      <Footer />
    </>
  );
}
