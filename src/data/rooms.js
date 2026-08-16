import hotelLobby from "../assets/rooms/hotel-lobby.jpeg";
import privateJet from "../assets/rooms/private-jet.jpeg";
import vintageElevator from "../assets/rooms/vintage-elevator.jpeg";
import subwayStation from "../assets/rooms/subway-station.jpeg";
import padelCourt from "../assets/rooms/padel-court.jpeg";
import prisonCell from "../assets/rooms/prison-cell.jpeg";
import washingMachine from "../assets/rooms/washing-machine.jpeg";

export const ROOMS = [
  { name: "Hotel Lobby", img: hotelLobby, price: "70K" },
  { name: "Private Jet", img: privateJet, price: "70K" },
  { name: "Vintage Elevator", img: vintageElevator, price: "70K" },
  { name: "Subway Station", img: subwayStation, price: "80K" },
  { name: "Padel Court", img: padelCourt, price: "50K" },
  { name: "Prison Cell", img: prisonCell, price: "60K" },
  { name: "Washing Machine", img: washingMachine, price: "70K" },
  { name: "Classic Studio", soon: true },
];
