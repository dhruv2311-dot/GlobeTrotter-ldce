export function getTripBudget(trip) {
  const amount = trip?.totalBudget ?? trip?.budgetAmount ?? 0;
  const numericAmount = Number(amount);
  return Number.isFinite(numericAmount) ? numericAmount : 0;
}

export function formatTripBudget(trip) {
  return getTripBudget(trip).toLocaleString();
}