export default function formatMoney(amount = 0) {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: amount % 100 ? 2 : 0, // Omit cents in round amounts
  });
  return formatter.format(amount / 100);
}
