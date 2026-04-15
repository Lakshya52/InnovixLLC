"use server"
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { cookies } from "next/headers";

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  const cookieStore = await cookies();
  const session = cookieStore.get("session"); // your cookie name

  const isLoggedIn = !!session;
  return (
    <>
      <div className="fixed top-0 left-0 w-full z-[9999] ">
        <Navbar isSidebar={false} isLoggedIn={isLoggedIn} />
      </div>
      {children}
      <Footer />
    </>
  );
}
