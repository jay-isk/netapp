export type Question = {
  day: number;
  question: string;
  options: string[];
  correctAnswer: string;
};

export const questions: Question[] = [
  {
    day: 1,
    question: "Who are the founders of NetApp?",
    options: [
      "Larry Ellison and Sergey Brin",
      "Michael Baum, Rob Das and Erik Swan",
      "David Hitz, James Lau, and Michael Malcolm",
      "Sandy Lerner and Leonard Bosack",
    ],
    correctAnswer: "David Hitz, James Lau, and Michael Malcolm",
  },
  {
    day: 2,
    question: "What are the key features of NetApp AI Data Engine?",
    options: [
      "Streamlines data ingestion, preparation, and delivery for AI/GenAI workloads.",
      "Embeds ransomware protection and security for mission‑critical AI data.",
      "Integrates with disaggregated all‑flash AFX systems to support massive AI clusters.",
      "All of the above",
    ],
    correctAnswer: "All of the above",
  },
  {
    day: 3,
    question: "Which NetApp feature helps prevent insider threats by requiring multiple administrators to approve critical commands?",
    options: [
      "Automated data encryption",
      "Multi-admin verification (MAV)",
      "Real-time network traffic monitoring",
      "Automated backup management"
    ],
    correctAnswer: "Multi-admin verification (MAV)",
  },
  {
    day: 4,
    question: "Which NFL team has NetApp partnered with to enhance their data management and analytics capabilities?",
    options: ["Buffalo Bills", "Los Angeles Rams", "San Francisco 49ers", "Green Bay Packers"],
    correctAnswer: "San Francisco 49ers",
  },
  {
    day: 5,
    question: "What is the Zero-Trust AI Factory?",
    options: [
      "A comprehensive AI solution that integrates data security across the enterprise",
      "A framework designed to enhance AI-driven business operations",
      "A comprehensive AI solution that ensures end-to-end data security and integrity",
      "A platform for automating business processes using AI",
    ],
    correctAnswer: "A comprehensive AI solution that ensures end-to-end data security and integrity",
  },
  {
    day: 6,
    question: "Which of the following companies are official NetApp partners?",
    options: ["Aston Martin F1", "Porsche Motorsport", "Ducati", "All of the above"],
    correctAnswer: "All of the above",
  },
  {
    day: 7,
    question: "What is a key feature of NetApp's ransomware protection solution?",
    options: [
      "Advanced data encryption for storage",
      "Early detection and rapid recovery",
      "Automated backup management",
      "Real-time network traffic monitoring"
    ],
    correctAnswer: "Early detection and rapid recovery",
  },
  {
    day: 8,
    question: "What percentage of users recommend NetApp products and services?",
    options: [
      "98%",
      "96%",
      "92%",
      "88%",
    ],
    correctAnswer: "98%",
  },
  {
    day: 9,
    question: "What does NetApp's Secure Multi-Tenancy feature provide?",
    options: [
      "Multiple data processing speed",
      "Isolation and security for multiple tenants in a shared environment",
      "Automated multi-backup management",
      "Real-time network traffic monitoring",
    ],
    correctAnswer: "Isolation and security for multiple tenants in a shared environment",
  },
  {
    day: 10,
    question: "When was Network Appliance officially renamed to NetApp, Inc.?",
    options: ["1998", "2000", "2004", "2008"],
    correctAnswer: "2008",
  },
  {
    day: 11,
    question: "How does NetApp help in optimizing VMware infrastructure?",
    options: [
      "By increasing licensing costs",
      "By reducing licensing costs and providing flexible storage solutions",
      "By limiting virtualization options",
      "By providing manual configuration options"
    ],
    correctAnswer: "By reducing licensing costs and providing flexible storage solutions",
  },
  {
    day: 12,
    question: "What does NetApp AFX do?",
    options: [
      "Supercharges AI data pipelines",
      "Delivers disaggregates and high-performance storage",
      "Automates and orchestrates data services across hybrid cloud environments",
      "All of the above"
    ],
    correctAnswer: "All of the above",
  },
];
