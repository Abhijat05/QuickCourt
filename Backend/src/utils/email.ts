import nodemailer from "nodemailer";

export const sendEmail = async (to: string, subject: string, text: string, html?: string) => {
  try {
    console.log("Setting up email transport with:", {
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      user: process.env.SMTP_USER,
      // Not logging password for security
    });
    
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
      debug: true, // Enable debug output
      logger: true // Log information to the console
    });
    
    console.log("Verifying transporter configuration...");
    await transporter.verify();
    console.log("Transporter verification successful");
    
    console.log("Sending email to:", to);
    
    const result = await transporter.sendMail({
      from: `"QuickCourt" <${process.env.SMTP_USER}>`,
      to,
      subject,
      text,
      html: html || `<p>${text}</p>` // Add HTML version for better email client support
    });
    
    console.log("Email sent result:", {
      messageId: result.messageId,
      response: result.response,
      envelope: result.envelope
    });
    
    return result;
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
};
