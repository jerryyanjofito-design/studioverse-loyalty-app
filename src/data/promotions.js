// Promotional posters data
// These will be displayed below the login/registration form
export const PROMOTIONS = [
  {
    id: 1,
    title: "Kamar Mewah Weekend",
    description: "Diskon 30% untuk menginap di suite premium kami",
    image: "/src/assets/rooms/hotel-lobby.jpeg",
    tag: "WEEKEND DEAL",
    link: "/promo/weekend-suite"
  },
  {
    id: 2,
    title: "Paket Foto Photobooth",
    description: "Gratis sesi foto photobooth dengan koleksi 5 stamps",
    image: "/src/assets/rooms/padel-court.jpeg",
    tag: "MEMBER EXCLUSIVE",
    link: "/promo/photobooth"
  }
];

// Helper function to get active promotions
export const getActivePromotions = () => {
  return PROMOTIONS.filter(p => p.active !== false);
};
