import promoPriceList from "../assets/promo-price-list.jpg";
import promoKeychainBundling from "../assets/promo-keychain-bundling.jpg";
import promo17an from "../assets/promo-17an.jpg";

// Promotional posters data
// These will be displayed below the login/registration form
export const PROMOTIONS = [
  {
    id: 1,
    title: "Bundling Keychain",
    description: "Dapatkan keychain eksklusif dengan bundling special",
    image: promoPriceList,
    tag: "SPECIAL BUNDLE",
    link: "/promo/keychain-bundling"
  },
  {
    id: 2,
    title: "Price List Ruangan",
    description: "Daftar harga kamar dan paket menginap yang tersedia",
    image: promoKeychainBundling,
    tag: "PRICE LIST",
    link: "/promo/price-list"
  },
  {
    id: 3,
    title: "Promo 17an",
    description: "Celebration promo kemerdekaan Indonesia dengan penawaran spesial",
    image: promo17an,
    tag: "17 AGUSTUS",
    link: "/promo/17an"
  }
];

// Helper function to get active promotions
export const getActivePromotions = () => {
  return PROMOTIONS.filter(p => p.active !== false);
};
