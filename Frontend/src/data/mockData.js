export const MOCK_DASHBOARD_DATA = {
  activeBookings: 3,
  pastBookings: 5,
  totalBookings: 9,
  cancelledBookings: 1,
  totalSpend: 2450,
  favoriteSports: ["Tennis", "Badminton", "Cricket"]
};

export const MOCK_BOOKINGS = [
  {
    id: 1,
    courtId: 2,
    court: { name: "Center Court" },
    venue: { name: "Tennis Paradise", id: 1 },
    courtName: "Center Court",
    venueName: "Tennis Paradise",
    date: "2023-07-15",
    startTime: "10:00",
    endTime: "12:00",
    status: "confirmed",
    sport: "Tennis",
    price: 800
  },
  {
    id: 2,
    courtId: 5,
    court: { name: "Court 3" },
    venue: { name: "Badminton Lounge", id: 2 },
    courtName: "Court 3",
    venueName: "Badminton Lounge",
    date: "2023-07-18",
    startTime: "14:00",
    endTime: "16:00",
    status: "confirmed",
    sport: "Badminton",
    price: 600
  },
  {
    id: 3,
    courtId: 8,
    court: { name: "Cricket Field" },
    venue: { name: "Sports Complex", id: 3 },
    courtName: "Cricket Field",
    venueName: "Sports Complex",
    date: "2023-07-20",
    startTime: "16:00",
    endTime: "18:00",
    status: "confirmed",
    sport: "Cricket",
    price: 1050
  },
  {
    id: 4,
    courtId: 2,
    court: { name: "Center Court" },
    venue: { name: "Tennis Paradise", id: 1 },
    courtName: "Center Court",
    venueName: "Tennis Paradise",
    date: "2023-06-10",
    startTime: "09:00",
    endTime: "11:00",
    status: "completed",
    sport: "Tennis",
    price: 800
  },
  {
    id: 5,
    courtId: 4,
    court: { name: "Court 2" },
    venue: { name: "Badminton Lounge", id: 2 },
    courtName: "Court 2",
    venueName: "Badminton Lounge",
    date: "2023-06-05",
    startTime: "18:00",
    endTime: "20:00",
    status: "completed",
    sport: "Badminton",
    price: 600
  },
  {
    id: 6,
    courtId: 7,
    court: { name: "Basketball Court" },
    venue: { name: "Sports Complex", id: 3 },
    courtName: "Basketball Court",
    venueName: "Sports Complex",
    date: "2023-06-02",
    startTime: "15:00",
    endTime: "17:00",
    status: "cancelled",
    sport: "Basketball",
    price: 750
  }
];