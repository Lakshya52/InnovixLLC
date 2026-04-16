"use client"
import { CircleCheck, ArrowRight, MessageCircle } from "lucide-react";
import Link from "next/link";

export default function ChatBot() {
    return (
        <>
            <div className="flex items-center justify-center min-h-fit my-10 lg:mt-30">
                <div className="flex flex-col lg:flex-row items-center justify-center w-[80dvw] h-fit bg-(--bg-dark) rounded-[40px] lg:rounded-[90px] overflow-hidden border border-(--accent)">
                    <div className="w-full lg:w-1/2 p-8 lg:p-20 flex flex-col gap-6 lg:gap-10 bg-(--bg-dark)">

                        <div className="flex items-center justify-start gap-2">
                            <span className="rounded-full h-2 w-2 bg-(--accent)" ></span><span className="font-inter text-(--accent) text-sm lg:text-lg font-bold" >ONLINE NOW</span>
                        </div>
                        <h1 className="text-4xl lg:text-5xl font-bold font-grotesk text-(--text-main)">Expert Minds, <span className="text-(--accent)" >ready to provide you support</span></h1>
                        <p className="font-inter text-(--text-main) text-base lg:text-lg max-w-3xl">
                            Don't get stuck in a loop. Our certified Microsoft technicians are
                            standing by to help with installation, activation, and
                            troubleshooting. Live 24/7/365.
                        </p>
                        <ul className="font-inter text-base lg:text-lg text-(--text-main) flex flex-col items-start gap-4">

                            {/* Item 1 */}
                            <li>
                                <div className="flex items-center gap-2">
                                    <CircleCheck size={20} className="text-(--accent) min-w-[20px]" />
                                    <span className="font-medium">Average Response: Under 45s</span>
                                </div>
                                <p className="ml-7 text-sm lg:text-base text-(--text-main)/60">
                                    Lightning fast support when you need it most.
                                </p>
                            </li>

                            {/* Item 2 */}
                            <li>
                                <div className="flex items-center gap-2">
                                    <CircleCheck size={20} className="text-(--accent) min-w-[20px]" />
                                    <span className="font-medium">Certified Experts</span>
                                </div>
                                <p className="ml-7 text-sm lg:text-base text-(--text-main)/60">
                                    Every agent is Microsoft 365 or Azure certified.
                                </p>
                            </li>

                        </ul>
                        {/* buy now button and view product details buttons */}
                        <Link href="/chatbot" className="button-green w-fit text-sm lg:text-base">Launch Live-Chat <MessageCircle className="ml-2 lg:ml-5 w-4 h-4 lg:w-6 lg:h-6" /></Link>

                    </div>
                    <div className="w-full lg:w-1/2 p-8 lg:p-10 flex items-center justify-center lg:justify-end">
                        <img src="/LiveChatSectionImage.png" alt="Live Chat Support" className="h-[40vh] sm:h-[50vh] lg:h-[80dvh] w-auto object-contain" />
                    </div>
                </div>
            </div>
        </>
    );
}