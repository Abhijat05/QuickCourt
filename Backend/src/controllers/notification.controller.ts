import { Request, Response } from "express";
import { db } from "../config/db";
import { notifications } from "../db/schema";
import { eq } from "drizzle-orm";

export const getUserNotifications = async (req: Request & { user?: any }, res: Response) => {
  const userId = req.user.id;
  
  try {
    const userNotifications = await db.select()
      .from(notifications)
      .where(eq(notifications.userId, userId))
      .orderBy(notifications.createdAt, "desc");
    
    res.json(userNotifications);
  } catch (error) {
    console.error("Error fetching notifications:", error);
    res.status(500).json({ message: "Failed to fetch notifications" });
  }
};

export const markNotificationAsRead = async (req: Request & { user?: any }, res: Response) => {
  const { notificationId } = req.params;
  const userId = req.user.id;
  
  try {
    await db.update(notifications)
      .set({ isRead: true })
      .where(and(
        eq(notifications.id, parseInt(notificationId)),
        eq(notifications.userId, userId)
      ));
    
    res.json({ message: "Notification marked as read" });
  } catch (error) {
    console.error("Error updating notification:", error);
    res.status(500).json({ message: "Failed to update notification" });
  }
};