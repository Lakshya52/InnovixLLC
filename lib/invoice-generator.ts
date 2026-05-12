import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

interface OrderDetail {
  id: string;
  productName: string;
  productType: string;
  amount: number;
  status: string;
  createdAt: Date | string;
  keys?: { keyValue: string }[];
}

interface UserDetail {
  name: string | null;
  email: string;
}

export const generateInvoice = (order: OrderDetail, user: UserDetail) => {
  const doc = new jsPDF();
  const date = new Date(order.createdAt).toLocaleDateString();
  const orderId = `#IVX-${order.id.slice(-6).toUpperCase()}`;

  // Add Logo/Header
  doc.setFontSize(22);
  doc.setTextColor(110, 221, 134); // Brand accent color #6eDD86
  doc.setFont("helvetica", "bold");
  doc.text("INNOVIX LLC", 14, 20);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text("DIGITAL SOLUTIONS & LICENSING", 14, 26);

  // Invoice Details
  doc.setFontSize(20);
  doc.setTextColor(0);
  doc.text("INVOICE", 140, 20);

  doc.setFontSize(10);
  doc.text(`Invoice No: ${orderId}`, 140, 30);
  doc.text(`Date: ${date}`, 140, 35);
  doc.text(`Status: ${order.status}`, 140, 40);

  // Billing Details
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("Bill To:", 14, 50);
  doc.setFont("helvetica", "normal");
  doc.text(user.name || "Customer", 14, 56);
  doc.text(user.email, 14, 61);

  // Table
  autoTable(doc, {
    startY: 75,
    head: [['Product', 'Type', 'Amount']],
    body: [
      [order.productName, order.productType, `$${order.amount.toFixed(2)}`]
    ],
    headStyles: { fillColor: [110, 221, 134] },
    alternateRowStyles: { fillColor: [245, 245, 245] },
  });

  const finalY = (doc as any).lastAutoTable.finalY || 100;

  // Keys if any
  if (order.keys && order.keys.length > 0) {
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("Product Keys:", 14, finalY + 15);
    doc.setFont("helvetica", "normal");
    order.keys.forEach((key, index) => {
      doc.text(key.keyValue, 14, finalY + 22 + (index * 6));
    });
  }

  // Footer
  doc.setFontSize(10);
  doc.setTextColor(150);
  doc.text("Thank you for your business!", 105, 280, { align: "center" });
  doc.text("InnovixLLC - Support: info@innovixllc.us", 105, 285, { align: "center" });

  return doc;
};

export const downloadInvoice = (order: OrderDetail, user: UserDetail) => {
  const doc = generateInvoice(order, user);
  doc.save(`Invoice-${order.id.slice(-6).toUpperCase()}.pdf`);
};
