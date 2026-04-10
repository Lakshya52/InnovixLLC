"use client"
import { CircleCheck, ArrowRight, MessageCircle } from "lucide-react";
import Link from "next/link";

export default function ChatBot() {
    return (
        <>

            <div className="flex items-center justify-center min-h-fit mt-30">
                <div className="flex items-center jusify-center w-[80dvw] h-fit bg-(--bg-less-dark) rounded-[90px]">
                    <div className="w-1/2 p-10 flex flex-col gap-10">

                        {/* <div className="relative z-10 flex flex-col justify-end items-start h-full p-10 text-white gap-10"> */}
                        <div className="flex items-center justify-start gap-2">

                            <span className="rounded-full h-2 w-2 bg-(--accent)" ></span><span className="font-inter text-(--accent) text-lg" >ONLINE NOW</span>
                        </div>
                        <h1 className="text-6xl font-bold font-grotesk text-(--text-main)">Expert Minds, <span className="text-(--accent)" >ready to provide you support</span></h1>
                        <p className="font-inter text-(--text-main) text-lg max-w-3xl">
                            Don't get stuck in a loop. Our certified Microsoft technicians are
                            standing by to help with installation, activation, and
                            troubleshooting. Live 24/7/365.
                        </p>
                        <ul className="font-inter text-lg text-(--text-main) flex flex-col items-start gap-4">

                            {/* Item 1 */}
                            <li>
                                <div className="flex items-center gap-2">
                                    <CircleCheck size={20} className="text-(--accent)" />
                                    <span className="font-medium">Average Response: Under 45s</span>
                                </div>
                                <p className="ml-7  text-(--text-main)/60">
                                    Lightning fast support when you need it most.
                                </p>
                            </li>

                            {/* Item 2 */}
                            <li>
                                <div className="flex items-center gap-2">
                                    <CircleCheck size={20} className="text-(--accent)" />
                                    <span className="font-medium">Certified Experts</span>
                                </div>
                                <p className="ml-7  text-(--text-main)/60">
                                    Every agent is Microsoft 365 or Azure certified.
                                </p>
                            </li>

                        </ul>
                        {/* buy now button and view product details buttons */}
                        <Link href="/chatbot" className="bg-(--accent) w-fit text-(--accent-dark) font-inter text-2xl rounded-full py-5 px-7 flex items-center justify-center gap-2 hover:scale-102 transition-all duration-300 cursor-pointer hover:shadow hover:shadow-[0px_0px_10px_var(--accent)]">Launch Live-Chat <MessageCircle /></Link>
                        {/* </div> */}


                    </div>
                    <div className="w-1/2 p-10 flex items-center justify-end">
                        <img src="/LiveChatSectionImage.png" alt="" className=" h-[80dvh] " /></div>
                </div>
            </div>

        </>
    );
}