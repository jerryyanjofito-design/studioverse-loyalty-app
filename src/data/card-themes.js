// Loyalty card themes. Each theme's `cards` array is indexed by live
// stamp count (0-9) — the cashier/app never overlays stamps dynamically;
// each state was pre-rendered by Jerry in Canva and is swapped wholesale.
// See the back-of-card `fields` for the SVG text overlay positions
// (member name + issued date), which ARE rendered dynamically since
// they're per-member and can't be baked into the static art.

import classicLicense from "../assets/cards/classic/license.jpeg";
import classicCard0 from "../assets/cards/classic/card-0.png";
import classicCard1 from "../assets/cards/classic/card-1.png";
import classicCard2 from "../assets/cards/classic/card-2.png";
import classicCard3 from "../assets/cards/classic/card-3.png";
import classicCard4 from "../assets/cards/classic/card-4.png";
import classicCard5 from "../assets/cards/classic/card-5.png";
import classicCard6 from "../assets/cards/classic/card-6.png";
import classicCard7 from "../assets/cards/classic/card-7.png";
import classicCard8 from "../assets/cards/classic/card-8.png";
import classicCard9 from "../assets/cards/classic/card-9.png";

import oldmoneyLicense from "../assets/cards/oldmoney/license.jpeg";
import oldmoneyCard0 from "../assets/cards/oldmoney/card-0.png";
import oldmoneyCard1 from "../assets/cards/oldmoney/card-1.png";
import oldmoneyCard2 from "../assets/cards/oldmoney/card-2.png";
import oldmoneyCard3 from "../assets/cards/oldmoney/card-3.png";
import oldmoneyCard4 from "../assets/cards/oldmoney/card-4.png";
import oldmoneyCard5 from "../assets/cards/oldmoney/card-5.png";
import oldmoneyCard6 from "../assets/cards/oldmoney/card-6.png";
import oldmoneyCard7 from "../assets/cards/oldmoney/card-7.png";
import oldmoneyCard8 from "../assets/cards/oldmoney/card-8.png";
import oldmoneyCard9 from "../assets/cards/oldmoney/card-9.png";

import valentineLicense from "../assets/cards/valentine/license.jpeg";
import valentineCard0 from "../assets/cards/valentine/card-0.png";
import valentineCard1 from "../assets/cards/valentine/card-1.png";
import valentineCard2 from "../assets/cards/valentine/card-2.png";
import valentineCard3 from "../assets/cards/valentine/card-3.png";
import valentineCard4 from "../assets/cards/valentine/card-4.png";
import valentineCard5 from "../assets/cards/valentine/card-5.png";
import valentineCard6 from "../assets/cards/valentine/card-6.png";
import valentineCard7 from "../assets/cards/valentine/card-7.png";
import valentineCard8 from "../assets/cards/valentine/card-8.png";
import valentineCard9 from "../assets/cards/valentine/card-9.png";

export const CARD_THEMES = [
  {
    id: "classic",
    name: "Classic",
    aspect: 1.585,
    license: classicLicense,
    cards: [
      classicCard0, classicCard1, classicCard2, classicCard3, classicCard4,
      classicCard5, classicCard6, classicCard7, classicCard8, classicCard9,
    ],
    fields: { nameX: 48.5, nameY: 36.5, issX: 50.5, issY: 56.5, color: "#3C281E" },
  },
  {
    id: "oldmoney",
    name: "Old Money",
    aspect: 1.585,
    license: oldmoneyLicense,
    cards: [
      oldmoneyCard0, oldmoneyCard1, oldmoneyCard2, oldmoneyCard3, oldmoneyCard4,
      oldmoneyCard5, oldmoneyCard6, oldmoneyCard7, oldmoneyCard8, oldmoneyCard9,
    ],
    fields: { nameX: 48.5, nameY: 36.5, issX: 50.5, issY: 56.5, color: "#3C2D1E" },
  },
  {
    id: "valentine",
    name: "Valentine",
    aspect: 1.585,
    license: valentineLicense,
    cards: [
      valentineCard0, valentineCard1, valentineCard2, valentineCard3, valentineCard4,
      valentineCard5, valentineCard6, valentineCard7, valentineCard8, valentineCard9,
    ],
    fields: { nameX: 48.5, nameY: 36.5, issX: 50.5, issY: 56.5, color: "#962028" },
  },
];

export const themeById = (id) => CARD_THEMES.find((t) => t.id === id) || CARD_THEMES[0];
