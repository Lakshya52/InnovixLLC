export interface Intent {
  name: string;
  keywords: string[];
}

export const INTENTS: Intent[] = [
  {
    name: "activation_help",
    keywords: ["activate", "activation", "key not working", "license issue", "fails", "error code", "slui", "genuine", "failed"]
  },
  {
    name: "pricing",
    keywords: ["price", "cost", "discount", "offer", "cheap", "bulk", "wholesale", "enterprise pricing"]
  },
  {
    name: "installation",
    keywords: ["install", "setup", "download", "how to install", "installer", "iso", "media creation tool"]
  },
  {
    name: "product_info",
    keywords: ["features", "include", "what is", "details", "difference", "version", "home", "pro", "365", "2021", "2024"]
  },
  {
    name: "compatibility",
    keywords: ["mac", "windows version", "system requirements", "tpm", "ram", "compatible", "hardware"]
  },
  {
    name: "licensing",
    keywords: ["lifetime", "subscription", "transfer", "devices", "multiple", "laptop", "retail", "oem", "one-time"]
  },
  {
    name: "support",
    keywords: ["help", "support", "issue", "problem", "urgent", "contact", "chat"]
  },
  {
    name: "delivery",
    keywords: ["delivery", "receive", "when", "how long", "wait", "email", "link", "instant"]
  },
  {
    name: "gratitude",
    keywords: [
      "thanks",
      "thank you",
      "thankyou",
      "thank u",
      "thx",
      "ty",
      "tysm",
      "thanks a lot",
      "thanks alot",
      "many thanks",
      "thanks so much",
      "thank you so much",
      "thank you very much",
      "thanks for your help",
      "thank you for your help",
      "thanks for the support",
      "thank you for the support",
      "appreciate it",
      "much appreciated",
      "really appreciate it",
      "i appreciate it",
      "grateful",
      "i'm grateful",
      "i am grateful",
      "thanks buddy",
      "thanks bro",
      "thanks man",
      "thanks dude",
      "thanks a ton",
      "thanks a bunch",
      "cheers",
      "cheers mate",
      "great thanks",
      "ok thanks",
      "okay thanks",
      "cool thanks",
      "awesome thanks",
      "perfect thanks",
      "got it thanks",
      "understood thanks",
      "alright thanks",
      "thanks for the info",
      "thanks for explaining",
      "thanks for clarifying",
      "thanks for your time",
      "thanks for the quick response",
      "thank you for the quick response",
      "thanks for helping",
      "thank you for helping",
      "thanks again",
      "thanks once again",
      "big thanks",
      "a big thanks",
      "huge thanks"
    ]
  }
];

export const KNOWLEDGE_BASE_RESPONSES: Record<string, string> = {
  activation_help: "Activation issues are priority for us. First, ensure you're connected to the internet. If you see a specific error, try the Windows Activation Troubleshooter in Settings. If that fails, our technical team can provide a new key or a remote fix immediately—please register as a technician or login for priority help.",
  pricing: "We offer the most competitive wholesale prices for genuine Microsoft software. Whether it's a single license or bulk enterprise keys, you'll find the best rates on our Products page. Large volume discounts are available for registered business accounts.",
  installation: "All purchases include instant digital delivery of official install links. We recommend using the official Microsoft ISO or Media Creation Tool. If you run into any setup hurdles, we provide complimentary installation guidance for all our customers.",
  product_info: "We specialize in the latest Microsoft releases including Windows 11 Pro/Home and Office 2024/2021. Our products are authentic lifetime licenses, ensuring you get full features and security updates directly from Microsoft.",
  compatibility: "Most modern hardware is compatible! Windows 11 requires TPM 2.0 and a 64-bit CPU. For Office, we have versions for both Windows and Mac. You can check specific system requirements on each product's detail page before purchasing.",
  licensing: "Our licenses are genuine lifetime purchases—no recurring subscriptions! Most are single-PC Retail or OEM keys. If you need to transfer a license or use it across multiple devices, our Enterprise plans offer that flexibility.",
  support: "Innovix support is available around the clock. Whether it's a minor installation question or a complex license migration, our engineers are here to help. For priority response, ensure you've registered your account.",
  delivery: "Innovation takes seconds, not days. You will receive your genuine product key and download links via email instantly after checkout. You can also view all your keys in your account dashboard at any time.",
  gratitude: "You're very welcome! I'm glad I could assist you today. If you have any other questions about our software or need further IT help, I'm always here for you. Have a productive day!"
};

export const getAIResponse = (query: string, history: string[]): { text: string; showRegister: boolean } => {
  const q = query.toLowerCase();

  // Calculate scores for each intent
  const scores = INTENTS.map(intent => {
    const matchCount = intent.keywords.reduce((acc, keyword) => {
      return acc + (q.includes(keyword) ? 1 : 0);
    }, 0);
    return { name: intent.name, score: matchCount };
  });

  // Sort by score and get the highest
  const bestMatch = scores.sort((a, b) => b.score - a.score)[0];

  // If we found a match with at least one keyword
  if (bestMatch.score > 0) {
    // Specifically handle complex keywords for redirection
    const complexKeywords = ["enterprise", "bulk", "api", "migration", "audit", "security", "reseller", "wholesale"];
    const isComplex = complexKeywords.some(kw => q.includes(kw)) || q.length > 150;

    const responseText = KNOWLEDGE_BASE_RESPONSES[bestMatch.name];

    return {
      text: responseText,
      showRegister: isComplex || bestMatch.name === "activation_help" // Redirection for complex or urgent activation tasks
    };
  }

  // Fallback for greetings or generic queries
  if (q.includes("hello") || q.includes("hi") || q.includes("hey")) {
    return {
      text: "Hello! I'm your Innovix smart assistant. I specialize in Microsoft software activation, licensing, and IT support. How can I help you navigate our products today?",
      showRegister: false
    };
  }

  // Catch-all but professional
  return {
    text: "I want to make sure I provide the most accurate assistance. Are you asking about a specific product activation, license type, or installation setup? I'm here to solve any IT hurdle you have.",
    showRegister: false
  };
};
