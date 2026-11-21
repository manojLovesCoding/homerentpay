import Payment from "../models/Payment.js";

export const getUnpaidMonths = async (property, tenantId) => {
  const now = new Date();
  const endIdx = now.getFullYear() * 12 + now.getMonth();

  const paid = await Payment.find({
    tenant: tenantId,
    property: property._id,
    status: "paid",
  }).select("month year");

  const paidSet = new Set(paid.map((p) => `${p.year}-${p.month}`));

  // Start of tenancy: assignedAt, else earliest paid payment (old data), else this month
  let startIdx = endIdx;
  if (property.assignedAt) {
    const d = new Date(property.assignedAt);
    startIdx = d.getFullYear() * 12 + d.getMonth();
  } else if (paid.length) {
    startIdx = Math.min(...paid.map((p) => p.year * 12 + (p.month - 1)));
  }

  const unpaid = [];
  for (let i = startIdx; i <= endIdx; i++) {
    const year = Math.floor(i / 12);
    const month = (i % 12) + 1;
    if (!paidSet.has(`${year}-${month}`)) {
      unpaid.push({ month, year, amount: property.rent });
    }
  }
  return unpaid; // oldest first
};