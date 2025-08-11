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
  ownerId: integer("owner_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  address: text("address").notNull(),
  location: varchar("location", { length: 255 }), // city, short location
  sportTypes: varchar("sport_types", { length: 255 }), // CSV or JSON
  amenities: text("amenities"), // CSV or JSON
  pricePerHour: integer("price_per_hour").notNull(),
  approved: boolean("approved").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  imageUrl: varchar("image_url", { length: 500 }),
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
