export function formatDate(isoDate: Date) {
  const date = new Date(isoDate);
  const day = date.getDate().toString().padStart(2, "0"); // Day with leading zero
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const month = monthNames[date.getMonth()]; // Month in short form
  const year = date.getFullYear(); // Full year
  return `${day}-${month}-${year}`;
}
