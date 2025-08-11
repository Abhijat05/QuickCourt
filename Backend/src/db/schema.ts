// src/db/schema/bookings.ts
import {
  pgTable,
  serial,
  time,
  integer,
  boolean,
  timestamp,
  varchar,
  smallint,
  text,
  numeric,
} from "drizzle-orm/pg-core";

export const bookings = pgTable("bookings", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  courtId: integer("court_id")
    .notNull()
    .references(() => courts.id, { onDelete: "cascade" }),
  date: timestamp("date").notNull(),
  startTime: varchar("start_time", { length: 10 }).notNull(),
  endTime: varchar("end_time", { length: 10 }).notNull(),
  status: varchar("status", { length: 20 }).default("confirmed"), // confirmed, cancelled, completed
  createdAt: timestamp("created_at").defaultNow(),
});

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  fullName: varchar("full_name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  passwordHash: varchar("password_hash", { length: 255 }).notNull(),
  isVerified: boolean("is_verified").default(false),
  twoFactorEnabled: boolean("two_factor_enabled").notNull().default(false),
  otpCode: varchar("otp_code", { length: 6 }),
  otpExpiry: timestamp("otp_expiry"),
  resetToken: varchar("reset_token", { length: 255 }),
  resetTokenExpiry: timestamp("reset_token_expiry"),
  role: varchar("role", { length: 20 }).notNull().default("user"),
  address: text("address"), // Added address field
  phone: integer("phone"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const courts = pgTable("courts", {
  id: serial("id").primaryKey(),
  venueId: integer("venue_id")
    .notNull()
    .references(() => venues.id, { onDelete: "cascade" }),
  name: varchar("name", { length: 255 }).notNull(),
  sportType: varchar("sport_type", { length: 100 }).notNull(),
  pricePerHour: integer("price_per_hour").notNull(),
  openingTime: time("opening_time").notNull(),
  closingTime: time("closing_time").notNull(),
  imageUrl: varchar("image_url", { length: 500 }),
});

export const reviews = pgTable("reviews", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  venueId: integer("venue_id")
    .notNull()
    .references(() => venues.id, { onDelete: "cascade" }),
  rating: smallint("rating").notNull(),
  comment: text("comment"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const venues = pgTable("venues", {
  id: serial("id").primaryKey(),
  ownerId: integer("owner_id").references(() => users.id),
  name: text("name").notNull(),
  description: text("description"),
  address: text("address").notNull(),
  location: text("location").notNull(),
  sportTypes: text("sport_types"),
  amenities: text("amenities"),
  pricePerHour: text("price_per_hour").notNull(), // Changed to text to match existing schema
  approved: boolean("approved").default(false),
  rejected: boolean("rejected").default(false),
  rejectionReason: text("rejection_reason"),
  openingTime: varchar("opening_time", { length: 10 }).default("08:00"),
  closingTime: varchar("closing_time", { length: 10 }).default("22:00"),
  createdAt: timestamp("created_at").defaultNow(),
  imageUrl: text("image_url"),
});

export const publicGames = pgTable("public_games", {
  id: serial("id").primaryKey(),
  bookingId: integer("booking_id")
    .notNull()
    .references(() => bookings.id, { onDelete: "cascade" }),
  hostId: integer("host_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  maxPlayers: integer("max_players").notNull(),
  currentPlayers: integer("current_players").default(1),
  skillLevel: varchar("skill_level", { length: 50 }), // beginner, intermediate, advanced
  status: varchar("status", { length: 20 }).default("open"), // open, full, cancelled
  createdAt: timestamp("created_at").defaultNow(),
});

export const gameParticipants = pgTable("game_participants", {
  id: serial("id").primaryKey(),
  gameId: integer("game_id")
    .notNull()
    .references(() => publicGames.id, { onDelete: "cascade" }),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  status: varchar("status", { length: 20 }).default("confirmed"), // confirmed, cancelled
  joinedAt: timestamp("joined_at").defaultNow(),
});
