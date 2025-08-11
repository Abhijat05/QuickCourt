import { Request, Response } from "express";
import { db } from "../config/db";
import { publicGames, gameParticipants, bookings, users, courts, venues } from "../db/schema";
import { eq, and, not, inArray } from "drizzle-orm";
import { sendEmail } from "../utils/email";

// Create a new public game
export const createPublicGame = async (req: Request & { user?: any }, res: Response) => {
  const { bookingId, title, description, maxPlayers, skillLevel } = req.body;
  const hostId = req.user.id;
  
  try {
    // Verify that this booking belongs to the user
    const userBooking = await db.select()
      .from(bookings)
      .where(and(
        eq(bookings.id, bookingId),
        eq(bookings.userId, hostId)
      ));
    
    if (userBooking.length === 0) {
      return res.status(403).json({ message: "You can only create games for your own bookings" });
    }

    // Check if a public game already exists for this booking
    const existingGame = await db.select()
      .from(publicGames)
      .where(eq(publicGames.bookingId, bookingId));
      
    if (existingGame.length > 0) {
      return res.status(400).json({ message: "A public game already exists for this booking" });
    }
    
    // Create public game
    const [newGame] = await db.insert(publicGames)
      .values({
        bookingId,
        hostId,
        title,
        description,
        maxPlayers,
        skillLevel,
        status: "open"
      })
      .returning();
    
    // Add the host as the first participant
    await db.insert(gameParticipants)
      .values({
        gameId: newGame.id,
        userId: hostId,
        status: "confirmed"
      });
    
    res.status(201).json({
      message: "Public game created successfully",
      game: newGame
    });
  } catch (error) {
    console.error("Error creating public game:", error);
    res.status(500).json({ message: "Failed to create public game" });
  }
};

// Get all available public games
export const getPublicGames = async (req: Request, res: Response) => {
  const { sportType, skillLevel, date } = req.query;
  
  try {
    const games = await db.select({
      game: publicGames,
      booking: {
        date: bookings.date,
        startTime: bookings.startTime,
        endTime: bookings.endTime,
      },
      host: {
        fullName: users.fullName
      },
      court: {
        id: courts.id,
        name: courts.name,
        sportType: courts.sportType
      },
      venue: {
        id: venues.id,
        name: venues.name,
        address: venues.address,
        location: venues.location
      }
    })
    .from(publicGames)
    .innerJoin(bookings, eq(publicGames.bookingId, bookings.id))
    .innerJoin(users, eq(publicGames.hostId, users.id))
    .innerJoin(courts, eq(bookings.courtId, courts.id))
    .innerJoin(venues, eq(courts.venueId, venues.id))
    .where(eq(publicGames.status, "open"));
    
    // Apply filters if provided
    let filteredGames = games;
    
    if (sportType) {
      filteredGames = filteredGames.filter(g => g.court.sportType === sportType);
    }
    
    if (skillLevel) {
      filteredGames = filteredGames.filter(g => g.game.skillLevel === skillLevel);
    }
    
    if (date) {
      filteredGames = filteredGames.filter(g => {
        const gameDate = new Date(g.booking.date).toISOString().split('T')[0];
        return gameDate === date;
      });
    }
    
    res.json(filteredGames);
  } catch (error) {
    console.error("Error fetching public games:", error);
    res.status(500).json({ message: "Failed to fetch public games" });
  }
};

// Join a public game
export const joinPublicGame = async (req: Request & { user?: any }, res: Response) => {
  const { gameId } = req.params;
  const userId = req.user.id;
  
  try {
    return await db.transaction(async (tx) => {
      // Check if game exists and is open
      const game = await tx.select()
        .from(publicGames)
        .where(and(
          eq(publicGames.id, parseInt(gameId)),
          eq(publicGames.status, "open")
        ));
      
      if (game.length === 0) {
        return res.status(404).json({ message: "Game not found or is no longer open" });
      }
      
      // Check if user is already a participant
      const existingParticipant = await tx.select()
        .from(gameParticipants)
        .where(and(
          eq(gameParticipants.gameId, parseInt(gameId)),
          eq(gameParticipants.userId, userId)
        ));
      
      if (existingParticipant.length > 0) {
        return res.status(400).json({ message: "You are already part of this game" });
      }
      
      const gameData = game[0];
      const currentPlayers = gameData?.currentPlayers ?? 0;
      const maxPlayers = gameData?.maxPlayers ?? 1;
      
      // Check if game is full
      if (currentPlayers >= maxPlayers) {
        return res.status(400).json({ message: "This game is already full" });
      }
      
      // Add user as participant
      await tx.insert(gameParticipants)
        .values({
          gameId: parseInt(gameId),
          userId,
          status: "confirmed"
        });
      
      // Count actual participants after insertion
      const allParticipants = await tx.select()
        .from(gameParticipants)
        .where(eq(gameParticipants.gameId, parseInt(gameId)));
      
      const actualPlayerCount = allParticipants.length;
      let newStatus = "open";
      
      // If now full, update status
      if (actualPlayerCount >= maxPlayers) {
        newStatus = "full";
      }
      
      // Update the game with accurate player count
      const [updatedGame] = await tx.update(publicGames)
        .set({ 
          currentPlayers: actualPlayerCount,
          status: newStatus
        })
        .where(eq(publicGames.id, parseInt(gameId)))
        .returning();
      
      // Get host information to send notification
      const hostInfo = await tx.select()
        .from(users)
        .where(eq(users.id, gameData?.hostId ?? 0));
      
      // Get joining user info
      const joiningUser = await tx.select()
        .from(users)
        .where(eq(users.id, userId));
      
      // Send email notification to host
      if (hostInfo.length > 0 && joiningUser.length > 0 && gameData?.hostId) {
        await sendEmail(
          hostInfo[0].email,
          "New player joined your game",
          `${joiningUser[0].fullName} has joined your game "${gameData.title}"`
        );
      }
      
      // Get all participants for response
      const participants = await tx.select({
        id: users.id,
        fullName: users.fullName,
        joinedAt: gameParticipants.joinedAt
      })
      .from(gameParticipants)
      .innerJoin(users, eq(gameParticipants.userId, users.id))
      .where(eq(gameParticipants.gameId, parseInt(gameId)))
      .orderBy(gameParticipants.joinedAt);
      
      return res.json({ 
        message: "Successfully joined the game",
        gameDetails: updatedGame,
        participants // Add participants list to response
      });
    });
  } catch (error) {
    console.error("Error joining public game:", error);
    res.status(500).json({ message: "Failed to join game" });
  }
};

// Leave a public game
export const leavePublicGame = async (req: Request & { user?: any }, res: Response) => {
  const { gameId } = req.params;
  const userId = req.user.id;
  
  try {
    // Check if user is part of the game
    const participant = await db.select()
      .from(gameParticipants)
      .where(and(
        eq(gameParticipants.gameId, parseInt(gameId)),
        eq(gameParticipants.userId, userId)
      ));
    
    if (participant.length === 0) {
      return res.status(400).json({ message: "You are not part of this game" });
    }
    
    // Get game details
    const game = await db.select()
      .from(publicGames)
      .where(eq(publicGames.id, parseInt(gameId)));
    
    if (game.length === 0) {
      return res.status(404).json({ message: "Game not found" });
    }
    
    // If user is the host, cancel the game
    if (game[0].hostId === userId) {
      // Update game status to cancelled
      await db.update(publicGames)
        .set({ status: "cancelled" })
        .where(eq(publicGames.id, parseInt(gameId)));
      
      // Notify all participants
      const participants = await db.select({
        participant: gameParticipants,
        user: {
          email: users.email,
          fullName: users.fullName
        }
      })
      .from(gameParticipants)
      .innerJoin(users, eq(gameParticipants.userId, users.id))
      .where(and(
        eq(gameParticipants.gameId, parseInt(gameId)),
        not(eq(gameParticipants.userId, userId))
      ));
      
      // Send cancellation emails
      for (const p of participants) {
        await sendEmail(
          p.user.email,
          "Game Cancelled",
          `The game "${game[0].title}" has been cancelled by the host.`
        );
      }
      
      return res.json({ message: "Game cancelled successfully" });
    } else {
      // Just remove the participant
      await db.delete(gameParticipants)
        .where(and(
          eq(gameParticipants.gameId, parseInt(gameId)),
          eq(gameParticipants.userId, userId)
        ));
      
      // Decrement current players count
      const currentGamePlayers = game[0]?.currentPlayers ?? 1;
      await db.update(publicGames)
        .set({ 
          currentPlayers: Math.max(0, currentGamePlayers - 1), // Ensure it doesn't go below 0
          status: game[0]?.status === "full" ? "open" : game[0]?.status
        })
        .where(eq(publicGames.id, parseInt(gameId)));
      
      // Notify host
      const hostInfo = await db.select()
        .from(users)
        .where(eq(users.id, game[0].hostId));
      
      const leavingUser = await db.select()
        .from(users)
        .where(eq(users.id, userId));
      
      await sendEmail(
        hostInfo[0].email,
        "Player left your game",
        `${leavingUser[0].fullName} has left your game "${game[0].title}"`
      );
      
      return res.json({ message: "Left game successfully" });
    }
  } catch (error) {
    console.error("Error leaving public game:", error);
    res.status(500).json({ message: "Failed to leave game" });
  }
};

// Get game details with participants
export const getGameDetails = async (req: Request, res: Response) => {
  const { gameId } = req.params;
  
  try {
    const game = await db.select({
      game: publicGames,
      booking: {
        date: bookings.date,
        startTime: bookings.startTime,
        endTime: bookings.endTime
      },
      host: {
        fullName: users.fullName
      },
      court: {
        name: courts.name,
        sportType: courts.sportType
      },
      venue: {
        name: venues.name,
        address: venues.address
      }
    })
    .from(publicGames)
    .innerJoin(bookings, eq(publicGames.bookingId, bookings.id))
    .innerJoin(users, eq(publicGames.hostId, users.id))
    .innerJoin(courts, eq(bookings.courtId, courts.id))
    .innerJoin(venues, eq(courts.venueId, venues.id))
    .where(eq(publicGames.id, parseInt(gameId)));
    
    if (game.length === 0) {
      return res.status(404).json({ message: "Game not found" });
    }
    
    // Get participants
    const participants = await db.select({
      id: users.id,
      fullName: users.fullName,
      joinedAt: gameParticipants.joinedAt
    })
    .from(gameParticipants)
    .innerJoin(users, eq(gameParticipants.userId, users.id))
    .where(eq(gameParticipants.gameId, parseInt(gameId)))
    .orderBy(gameParticipants.joinedAt);
    
    res.json({
      ...game[0],
      participants
    });
  } catch (error) {
    console.error("Error fetching game details:", error);
    res.status(500).json({ message: "Failed to fetch game details" });
  }
};

// Get all games a user is participating in
export const getUserGames = async (req: Request & { user?: any }, res: Response) => {
  const userId = req.user.id;
  
  try {
    // Get all games where user is a participant
    const participatingGames = await db.select({
      gameId: gameParticipants.gameId
    })
    .from(gameParticipants)
    .where(eq(gameParticipants.userId, userId));
    
    // If user is not participating in any games
    if (participatingGames.length === 0) {
      return res.json([]);
    }
    
    // Get game details for all participating games
    const gameIds = participatingGames.map(p => p.gameId);
    
    const games = await db.select({
      game: publicGames,
      booking: {
        date: bookings.date,
        startTime: bookings.startTime,
        endTime: bookings.endTime
      },
      host: {
        id: users.id,
        fullName: users.fullName
      },
      court: {
        name: courts.name,
        sportType: courts.sportType
      },
      venue: {
        name: venues.name,
        address: venues.address
      }
    })
    .from(publicGames)
    .innerJoin(bookings, eq(publicGames.bookingId, bookings.id))
    .innerJoin(users, eq(publicGames.hostId, users.id))
    .innerJoin(courts, eq(bookings.courtId, courts.id))
    .innerJoin(venues, eq(courts.venueId, venues.id))
    .where(inArray(publicGames.id, gameIds));
    
    res.json(games);
  } catch (error) {
    console.error("Error fetching user games:", error);
    res.status(500).json({ message: "Failed to fetch user games" });
  }
};

// Check game participants
export const checkGameParticipants = async (req: Request, res: Response) => {
  const { gameId } = req.params;
  
  try {
    // Count participants
    const participants = await db.select()
      .from(gameParticipants)
      .where(eq(gameParticipants.gameId, parseInt(gameId)));
    
    // Get game details
    const game = await db.select()
      .from(publicGames)
      .where(eq(publicGames.id, parseInt(gameId)));
    
    res.json({
      participantCount: participants.length,
      storedCount: game[0]?.currentPlayers,
      participants: participants
    });
  } catch (error) {
    console.error("Error checking participants:", error);
    res.status(500).json({ message: "Failed to check participants" });
  }
};

// Get game participants
export const getGameParticipants = async (req: Request, res: Response) => {
  const { gameId } = req.params;
  
  try {
    // Get participants
    const participants = await db.select({
      id: gameParticipants.id,
      userId: gameParticipants.userId,
      userFullName: users.fullName,
      userEmail: users.email,
      status: gameParticipants.status,
      joinedAt: gameParticipants.joinedAt
    })
    .from(gameParticipants)
    .innerJoin(users, eq(gameParticipants.userId, users.id))
    .where(eq(gameParticipants.gameId, parseInt(gameId)))
    .orderBy(gameParticipants.joinedAt);
    
    // Get game info
    const game = await db.select()
      .from(publicGames)
      .where(eq(publicGames.id, parseInt(gameId)));
    
    res.json({
      game: game.length > 0 ? game[0] : null,
      participantsCount: participants.length,
      participants
    });
  } catch (error) {
    console.error("Error fetching game participants:", error);
    res.status(500).json({ message: "Failed to fetch participants" });
  }
};

// Close (lock) a public game (host or admin)
export const closePublicGame = async (req: Request & { user?: any }, res: Response) => {
  const { gameId } = req.params;
  try {
    const game = await db.select()
      .from(publicGames)
      .where(eq(publicGames.id, parseInt(gameId)));
    
    if (game.length === 0) {
      return res.status(404).json({ message: "Game not found" });
    }
    const g = game[0];
    if (g.hostId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: "Not authorized to close this game" });
    }
    if (g.status === 'closed') {
      return res.json({ message: "Game already closed" });
    }
    await db.update(publicGames)
      .set({ status: "closed" })
      .where(eq(publicGames.id, parseInt(gameId)));
    
    return res.json({ message: "Game closed successfully" });
  } catch (error) {
    console.error("Error closing game:", error);
    res.status(500).json({ message: "Failed to close game" });
  }
};

