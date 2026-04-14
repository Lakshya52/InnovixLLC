import React from "react";
import { 
  Monitor, 
  Briefcase, 
  Database, 
  LayoutGrid,
  Shield,
  Zap,
  Cpu,
  Globe,
  Lock,
  Terminal,
  Server
} from "lucide-react";

export interface Product {
  id: string;
  name: string;
  category: string;
  subCategory: string;
  description: string;
  longPara1: string;
  longPara2: string;
  price: string;
  image: string;
  isBestseller?: boolean;
  features: string[];
  specs: { label: string; value: string }[];
  keyFeatures: { icon: string; title: string; description: string }[];
  systemRequirements?: {
    component: string;
    minimum: string;
    recommended: string;
  }[];
  trustArchitecture?: {
    title: string;
    points: string[];
  };
}

export const products: Product[] = [
  {
    id: "windows-11-pro",
    name: "Windows 11 Pro Digital Key",
    category: "Windows",
    subCategory: "Operating Systems",
    description: "The ultimate precision operating system designed for hybrid work. Elevate your performance with surgical-grade multitasking and enterprise-class security.",
    longPara1: "Windows 11 Pro is engineered for the high-performance professional. Built on a refined kernel, it delivers surgical precision in system resource allocation, ensuring that your mostcritical enterprise applications always have the bandwidth they need.",
    longPara2:"Experience a kinetic UI that responds to your workflow. From instant-on capabilities to seamless wake-from-sleep, every interaction is optimized for speed and reliability in a mission-critical environment.",
    price: "199.99",
    image: "/Windows11.png",
    isBestseller: true,
    features: [
      "BitLocker Device Encryption",
      "Windows Information Protection (WIP)",
      "Remote Desktop",
      "Assigned Access",
      "Dynamic Provisioning"
    ],
    specs: [
      { label: "Developer", value: "Microsoft" },
      { label: "Activation", value: "Online / Phone" },
      { label: "Devices", value: "1 PC" },
      { label: "Validity", value: "Lifetime" },
      { label: "Language", value: "Global / Multilingual" }
    ],
    keyFeatures: [
      { icon: "Shield", title: "Enhanced Security", description: "Hardware-based isolation, encryption, and malware protection." },
      { icon: "Zap", title: "High Performance", description: "DirectStorage and Auto HDR for faster loading and better visuals." },
      { icon: "Cpu", title: "Modern CPU Support", description: "Optimized for the latest processors and architecture." }
    ],
    systemRequirements: [
      { component: "Processor", minimum: "1 GHz or faster with 2 or more cores on a compatible 64-bit processor", recommended: "2 GHz or faster with 4 or more cores" },
      { component: "RAM", minimum: "4 GB or more", recommended: "8 GB or more" },
      { component: "Storage", minimum: "64 GB or larger storage device", recommended: "128 GB or larger SSD" },
      { component: "System Firmware", minimum: "UEFI, Secure Boot capable", recommended: "UEFI, Secure Boot capable" },
      { component: "TPM", minimum: "Trusted Platform Module (TPM) version 2.0", recommended: "Trusted Platform Module (TPM) version 2.0" },
      { component: "Graphics Card", minimum: "Compatible with DirectX 12 or later with WDDM 2.0 driver", recommended: "Compatible with DirectX 12 or later with WDDM 2.0 driver" }
    ],
    trustArchitecture: {
      title: "Trust Architecture",
      points: [
        "Verified Licensing with instant digital keys delivered to your dashboard.",
        "Lifetime activation guarantee with dedicated 24/7 technical support.",
        "Full enterprise features including BitLocker and Windows Information Protection."
      ]
    }
  },
  {
    id: "office-2024",
    name: "Office 2024 Professional Plus",
    category: "Office Suite",
    subCategory: "Productivity",
    description: "Essential productivity suite including Word, Excel, and PowerPoint. Perpetual license for professional environments.",
    longPara1: "Office 2024 Professional Plus is the most comprehensive productivity suite for businesses and professionals. It includes everything you need to create, communicate, and collaborate efficiently, without the need for a subscription.",
    longPara2:"Experience a kinetic UI that responds to your workflow. From instant-on capabilities to seamless wake-from-sleep, every interaction is optimized for speed and reliability in a mission-critical environment.",
    price: "439.00",
    image: "/office2024.png",
    isBestseller: false,
    features: [
      "Word 2024",
      "Excel 2024",
      "PowerPoint 2024",
      "Outlook 2024",
      "Access & Publisher"
    ],
    specs: [
      { label: "License Type", value: "Retail / Perpetual" },
      { label: "Platform", value: "PC / Desktop" },
      { label: "Version", value: "2024" },
      { label: "Delivery", value: "Digital Email" },
      { label: "Support", value: "24/7 Priority" }
    ],
    keyFeatures: [
      { icon: "Globe", title: "Cloud Integration", description: "Seamlessly save and share files across devices." },
      { icon: "Lock", title: "Secure Access", description: "Enhanced security for documents and communication." },
      { icon: "Briefcase", title: "Pro Tools", description: "Advanced data analysis and presentation tools." }
    ],
    systemRequirements: [
      { component: "Processor", minimum: "1.6 GHz or faster, 2-core", recommended: "2.0 GHz or faster, 4-core" },
      { component: "RAM", minimum: "4 GB RAM", recommended: "8 GB RAM" },
      { component: "Storage", minimum: "4.0 GB available disk space", recommended: "10.0 GB available SSD space" },
      { component: "Display", minimum: "1280 x 768 screen resolution", recommended: "1920 x 1080 screen resolution" },
      { component: "Graphics", minimum: "DirectX 9 or later with WDDM 2.0", recommended: "DirectX 10 or later" }
    ],
    trustArchitecture: {
      title: "Enterprise Trust",
      points: [
        "100% Genuine Retail Keys with lifetime warranty.",
        "Secure digital activation directly with Microsoft servers.",
        "Comprehensive suite of productivity tools for business-critical workflows."
      ]
    }
  },
  {
    id: "visio-pro",
    name: "Visio Pro 2024 Professional",
    category: "Office Suite",
    subCategory: "Diagramming",
    description: "Create professional diagrams with ease. Includes updated shapes, templates, and enhanced collaboration tools.",
    longPara1: "Visio Professional 2024 makes it easier than ever for individuals and teams to create and share professional, versatile diagrams that simplify complex information.",
    longPara2:"Experience a kinetic UI that responds to your workflow. From instant-on capabilities to seamless wake-from-sleep, every interaction is optimized for speed and reliability in a mission-critical environment.",
    price: "579.00",
    image: "/visio2024.png",
    features: [
      "250,000+ Shapes",
      "Dynamic Data Linking",
      "Industry Standard Support",
      "Collaboration Tracking",
      "Real-time Updates"
    ],
    specs: [
      { label: "Architecture", value: "32/64 bit" },
      { label: "Region", value: "Worldwide" },
      { label: "Update", value: "Automatic" },
      { label: "Activation", value: "Permanent" },
      { label: "Format", value: "Digital" }
    ],
    keyFeatures: [
      { icon: "LayoutGrid", title: "Versatile Shapes", description: "Huge library of industry-specific shapes and icons." },
      { icon: "Zap", title: "Real-time Data", description: "Diagrams that update automatically with live data." },
      { icon: "Cpu", title: "Team Collab", description: "Work together on one diagram simultaneously." }
    ]
  },
  {
    id: "sql-server-2022",
    name: "SQL Server 2022 Standard",
    category: "Servers",
    subCategory: "Databases",
    description: "Scale your data with confidence. Built-in security, industry-leading performance, and intelligence for all your data.",
    longPara1: "SQL Server 2022 is the most Azure-enabled release yet, with continued innovation in performance, security, and availability.",
    longPara2:"Experience a kinetic UI that responds to your workflow. From instant-on capabilities to seamless wake-from-sleep, every interaction is optimized for speed and reliability in a mission-critical environment.",
    price: "899.00",
    image: "/SqlServer2022.png",
    features: [
      "Azure Synapse Link",
      "Object Storage Integration",
      "Built-in Query Intelligence",
      "Always-on Availability",
      "Advanced Auditing"
    ],
    specs: [
      { label: "Type", value: "Standard Edition" },
      { label: "Cores", value: "Up to 24 Cores" },
      { label: "Memory", value: "Up to 128 GB" },
      { label: "Integration", value: "Hybrid Cloud" },
      { label: "Protocol", value: "IPv6 Ready" }
    ],
    keyFeatures: [
      { icon: "Database", title: "Hybrid Scale", description: "Connect to Azure for managed disaster recovery." },
      { icon: "Terminal", title: "In-memory Speed", description: "Industry-leading OLTP and Analytics performance." },
      { icon: "Server", title: "Cross-platform", description: "Deploy on Windows, Linux, or Containers." }
    ]
  }
];
