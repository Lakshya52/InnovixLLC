"use client";

import React from "react";
import Link from "next/link";

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-(--bg-dark) w-full flex items-center justify-center py-12 border-t border-white/5">
            <div className=" w-[80dvw] flex flex-col md:flex-row justify-between items-center gap-8">
                {/* Left Side: Brand & Copyright */}
                <div className="flex flex-col items-center md:items-start gap-2">
                    <Link href="/" className="text-2xl font-bold text-[#6eDD86] font-grotesk">
                        InnovixLLC
                    </Link>
                    <p className="text-gray-500 text-sm font-inter">
                        © {currentYear} InnovixLLC. High-Performance Precision.
                    </p>
                </div>

                {/* Right Side: Links */}
                <nav className="flex flex-wrap justify-center md:justify-end gap-x-8 gap-y-4">
                    <Link
                        href="/privacy"
                        className="text-gray-400 hover:text-white text-sm font-inter transition-colors duration-200"
                    >
                        Privacy Policy
                    </Link>
                    <Link
                        href="/terms"
                        className="text-gray-400 hover:text-white text-sm font-inter transition-colors duration-200"
                    >
                        Terms of Service
                    </Link>
                    <Link
                        href="/licensing"
                        className="text-gray-400 hover:text-white text-sm font-inter transition-colors duration-200"
                    >
                        Licensing
                    </Link>
                    <Link
                        href="/support"
                        className="text-gray-400 hover:text-white text-sm font-inter transition-colors duration-200"
                    >
                        Support
                    </Link>
                </nav>
            </div>
        </footer>
    );
}
