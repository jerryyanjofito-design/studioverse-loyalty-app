// Promotional posters data
// These will be displayed below the login/registration form
export const PROMOTIONS = [
  {
    id: 1,
    title: "Price List Kamar",
    description: "Daftar harga kamar dan paket menginap yang tersedia",
    image: "/src/assets/promo-price-list.jpg",
    tag: "PRICE LIST",
    link: "/promo/price-list"
  },
  {
    id: 2,
    title: "Bundling Keychain",
    description: "Dapatkan keychain eksklusif dengan bundling special",
    image: "/src/assets/promo-keychain-bundling.jpg",
    tag: "SPECIAL BUNDLE",
    link: "/promo/keychain-bundling"
  },
  {
    id: 3,
    title: "Promo 17an",
    description: "Celebration promo kemerdekaan Indonesia dengan penawaran spesial",
    image: "/src/assets/promo-17an.jpg",
    tag: "17 AGUSTUS",
    link: "/promo/17an"
  }
];

// Helper function to get active promotions
export const getActivePromotions = () => {
  return PROMOTIONS.filter(p => p.active !== false);
};
