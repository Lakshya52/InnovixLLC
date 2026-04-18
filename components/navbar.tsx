"use client"

import { ShoppingCart } from "lucide-react";
import { ThemeToggle } from "./theme-toggle";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { Menu, X } from "lucide-react"
import { useState } from "react";


export default function Navbar({ isSidebar = false, isLoggedIn = false }: { isSidebar?: boolean, isLoggedIn?: boolean }) {
    const pathname = usePathname();
    const { cartCount } = useCart();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const navLinks = [
        { name: "Home", href: "/" },
        { name: "Products", href: "/products" },
        { name: "Live Chat", href: "/chatbot" },
        { name: "About Us", href: "/about" },
        { name: "Blog", href: "/blogs" },
        { name: "Contact", href: "/contact" },
    ];
    const handleMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen)
    }

    return (
        <div className="flex flex-col items-center justify-center  bg-[var(--bg-less-dark)]/50 backdrop-blur-xl  h-[15dvh] z-[9999] w-full ">
            <nav className={`flex items-center justify-between ${isSidebar ? "w-[90%]" : "w-[80%]"} mx-auto `}>

                {/* Logo */}
                <Link href="/" className="font-grotesk text-[var(--accent)] font-bold text-3xl">
                    InnovixLLC
                </Link>

                {/* right side */}
                <div className="flex items-center gap-5">

                    {/* Nav Links */}
                    <ul className="hidden xl:flex text-lg gap-5 h-[40px] items-center">
                        {navLinks.map((link) => {
                            const isActive = pathname === link.href;

                            return (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        className={`border-b-2 pb-1 transition-all duration-150 ${isActive ? "border-[var(--accent)] text-[var(--accent)]" : "border-transparent hover:border-[var(--accent)] hover:text-[var(--accent)]"}`}
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>

                    {/* Right side */}
                    <div className="sm:mx-5 flex items-center gap-5">
                        <ThemeToggle />

                        <Link href="/cart" className="flex items-start relative group">
                            <ShoppingCart className="group-hover:text-[var(--accent)] transition-colors h-5 w-5 sm:h-6 sm:w-6  " />
                            {cartCount > 0 && (
                                <span className="absolute -top-2 -right-2 rounded-full h-5 w-5 bg-red-500 text-(--text-main) text-[10px] font-bold flex items-center justify-center animate-in zoom-in duration-300">
                                    {cartCount}
                                </span>
                            )}
                        </Link>
                        {isMobileMenuOpen ? (
                            <X className="xl:hidden block h-5 w-5 sm:h-6 sm:w-6   " onClick={handleMenu} />
                        ) : (
                            <Menu className="xl:hidden block h-5 w-5 sm:h-6 sm:w-6   " onClick={handleMenu} />
                        )}
                    </div>

                    {/* CTA */}
                    {!(isSidebar && isLoggedIn) && (
                        <Link
                            href={isLoggedIn ? "/dashboard" : "/registration"}
                            className="hidden sm:block"
                        >
                            <button className="button-green">
                                {isLoggedIn ? "Dashboard" : "Get Started"}
                            </button>
                        </Link>
                    )}

                </div>
            </nav>
            {isMobileMenuOpen && (

                <div className="xl:hidden border-b border-(--accent) shadow-2xl absolute z-9999 top-0 mt-[15dvh] h-fit w-full bg-[var(--bg-less-dark)] backdrop-blur-xl  flex flex-col items-center justify-center gap-10 py-10">
                    <ul className="flex flex-col gap-5 h-fit items-center ">
                        {navLinks.map((link) => {
                            const isActive = pathname === link.href;

                            return (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        onClick={() => {
                                            setIsMobileMenuOpen(false)
                                        }}
                                        className={`border-b-2 pb-1 transition-all duration-150 ${isActive ? "border-[var(--accent)] text-[var(--accent)]" : "border-transparent hover:border-[var(--accent)] hover:text-[var(--accent)]"}`}
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                    {!(isSidebar && isLoggedIn) && (
                        <Link
                            href={isLoggedIn ? "/dashboard" : "/registration"}
                            className="w-full px-10 sm:hidden block"
                        >
                            <button className="button-green w-full flex items-center justify-center">
                                {isLoggedIn ? "Dashboard" : "Get Started"}
                            </button>
                        </Link>
                    )}
                </div>
            )}
        </div>
    );
}