"use client";

import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

interface FAQItem {
  question: string;
  answer: string;
}

const faqData: FAQItem[] = [
  {
    question: "How do I receive my key?",
    answer: "After completing your purchase, your license key will be delivered instantly to your registered email address. You can also access it from your account dashboard under the 'My Orders' section.",
  },
  {
    question: "Are these licenses genuine?",
    answer: "Yes, all our licenses are 100% genuine and authorized. We source them directly from official distributors to ensure you receive fully functional and legal software.",
  },
  {
    question: "What if I need technical help?",
    answer: "Our expert support team is available 24/7 to assist you. You can reach out via our contact page, live chat, or email, and we'll guide you through any technical issues or installation steps.",
  },
  {
    question: "Can I move the license to another computer?",
    answer: "Most of our licenses are tied to a single device. However, some retail versions allow transfer. Please check the specific product description for transferability details or contact support for help with deactivation.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="bg-(--bg-less-dark) w-full py-24 px-4 md:px-8 border-t border-white/5">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-6  font-grotesk">
            Frequently Asked Questions
          </h2>
          <p className="text-gray-400 text-lg md:text-xl font-inter">
            Everything you need to know about our products and services.
          </p>
        </div>

        <div className="space-y-6">
          {faqData.map((item, index) => (
            <div
              key={index}
              className="group border border-white/5 bg-white/[0.02] rounded-[50px] overflow-hidden transition-all duration-500 hover:bg-white/[0.04] hover:border-white/10 hover:shadow-[0_0_30px_rgba(74,222,128,0.05)]"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full flex items-center justify-between p-7 md:p-9 text-left transition-all duration-300"
              >
                <span className="text-xl md:text-2xl text-white/90 group-hover:text-white transition-colors font-grotesk">
                  {item.question}
                </span>
                <div className={`p-2 transition-all duration-300 ${openIndex === index ? "" : ""}`}>
                  <ChevronDown
                    className={`w-6 h-6 text-[#4ade80] transition-transform duration-500 ${
                      openIndex === index ? "rotate-180 scale-110" : "rotate-0 scale-100"
                    }`}
                  />
                </div>
              </button>
              
              <div
                className={`overflow-hidden transition-all duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] ${
                  openIndex === index 
                    ? "max-h-[500px] opacity-100" 
                    : "max-h-0 opacity-0"
                }`}
              >
                <div className="px-7 pb-7 md:px-9 md:pb-9 text-gray-400 text-xl leading-relaxed border-t border-white/5 pt-6 font-inter">
                  {item.answer}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
