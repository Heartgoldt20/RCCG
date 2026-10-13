export const gatherings = [
  { id: "sunday", title: "Sunday Celebration", day: "Every Sunday", time: "11:00", location: "Wijkcentrum de Mortel, Eindhoven", description: "Let us know you are coming. You are also welcome without registering." },
  { id: "eindhoven", title: "Home Cell Eindhoven", day: "Every Thursday", time: "19:00", location: "Eindhoven", description: "Register your interest and contact the church for the meeting address." },
  { id: "helmond", title: "Home Cell Helmond", day: "Every Thursday", time: "19:00", location: "Helmond", description: "Register your interest and contact the church for the meeting address." },
  { id: "best", title: "Home Cell Best", day: "Every Thursday", time: "21:00", location: "Best · online option", description: "Register your interest and contact the church for the meeting link." },
] as const;
export const ministryOptions = ["Worship", "Media", "Welcome team", "Children’s ministry", "Prayer team"] as const;
