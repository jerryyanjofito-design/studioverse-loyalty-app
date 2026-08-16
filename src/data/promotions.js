// Promotional posters data
// These will be displayed below the login/registration form
export const PROMOTIONS = [
  {
    id: 1,
    title: "Suite Weekend",
    description: "Diskon 30% untuk menginap di suite premium kami",
    image: "/src/assets/rooms/hotel-lobby.jpeg",
    tag: "WEEKEND DEAL",
    link: "/promo/weekend-suite"
  },
  {
    id: 2,
    title: "Photobooth Gratis",
    description: "Gratis sesi foto photobooth dengan 5 stamps",
    image: "/src/assets/rooms/padel-court.jpeg",
    tag: "MEMBER EXCLUSIVE",
    link: "/promo/photobooth"
  },
  {
    id: 3,
    title: "Private Jet Experience",
    description: "Nikmati pengalaman terbang dengan jet pribadi",
    image: "/src/assets/rooms/private-jet.jpeg",
    tag: "LUXURY",
    link: "/promo/private-jet"
  },
  {
    id: 4,
    title: "Prison Cell Theme",
    description: "Menginap di tema sel unik dan berbeda",
    image: "/src/assets/rooms/prison-cell.jpeg",
    tag: "THEME ROOM",
    link: "/promo/prison-cell"
  },
  {
    id: 5,
    title: "Vintage Elevator",
    description: "Pengalaman menginap dengan tema retro klasik",
    image: "/src/assets/rooms/vintage-elevator.jpeg",
    tag: "RETRO",
    link: "/promo/vintage-elevator"
  }
];

// Helper function to get active promotions
export const getActivePromotions = () => {
  return PROMOTIONS.filter(p => p.active !== false);
};
