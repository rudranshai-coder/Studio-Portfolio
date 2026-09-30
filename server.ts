import express from "express";
import path from "path";
import fs from "fs";
import nodemailer from "nodemailer";

async function startServer() {
  const app = express();
  // Middleware to parse JSON body
  app.use(express.json());

  // API routes FIRST
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  const sendEmail = async (to: string, subject: string, text: string, replyTo?: string) => {
    const emailPass = process.env.EMAIL_PASS;
    const resendApiKey = process.env.RESEND_API_KEY;

    if (emailPass) {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: "rudranshgoyal44@gmail.com",
          pass: emailPass,
        },
      });

      await transporter.sendMail({
        from: '"Rudransh Portfolio" <rudranshgoyal44@gmail.com>',
        to,
        subject,
        text,
        replyTo,
      });
      return { success: true };
    }

    if (resendApiKey) {
      const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${resendApiKey}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          from: "Rudransh Portfolio <onboarding@resend.dev>",
          to,
          subject,
          text,
          reply_to: replyTo
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to send email via Resend");
      }
      return { success: true };
    }

    throw new Error("No email service configured. Please add EMAIL_PASS to environment variables.");
  };

  app.post("/api/contact", async (req, res) => {
    try {
      const { name, email, phone, message, workType } = req.body;
      
      const subject = `Collaboration Request: [${workType || 'Creative Inquiry'}] from ${name}`;
      const text = `New Collaboration Request\n-------------------------\nApplicant Name: ${name}\nEmail Address: ${email}\nContact Number: ${phone}\nSelected Work: ${workType || 'Not specified'}\n\nProject Description:\n${message}`;
      
      await sendEmail("rudranshgoyal44@gmail.com", subject, text, email);
      res.json({ success: true });
    } catch (error: any) {
      console.error("Error in /api/contact:", error);
      res.status(500).json({ success: false, message: error.message });
    }
  });

  app.post("/api/admin/reply", async (req, res) => {
    try {
      const { to, applicantName, replyMessage, recordId } = req.body;
      
      if (!to || !replyMessage) {
        return res.status(400).json({ success: false, message: "Recipient email and reply message are required." });
      }

      const subject = `Update regarding your project request (${recordId || 'Rudransh Goyal'})`;
      const text = `Hi ${applicantName || 'there'},\n\nThank you for submitting your project request. Here is an update regarding your inquiry:\n\n${replyMessage}\n\nBest regards,\nRudransh Goyal\nAI Creative Portfolio`;
      
      await sendEmail(to, subject, text, "rudranshgoyal44@gmail.com");
      res.json({ success: true });
    } catch (error: any) {
      console.error("Error in /api/admin/reply:", error);
      res.status(500).json({ success: false, message: error.message });
    }
  });

  // In dev mode (npm run dev), npm_lifecycle_event is 'dev'.
  // In production (Cloud Run, npm start), dist/index.html exists and npm_lifecycle_event is NOT 'dev'.
  const distPath = path.join(process.cwd(), "dist");
  const distExists = fs.existsSync(path.join(distPath, "index.html"));
  const isDevCommand = process.env.npm_lifecycle_event === "dev";
  const isProduction = (distExists && !isDevCommand) || process.env.NODE_ENV === "production";

  if (!isProduction) {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  const PORT = 3000;

  function listenOnPort(port: number) {
    const server = app.listen(port, "0.0.0.0", () => {
      console.log(`Server running on http://0.0.0.0:${port}`);
    });
    server.on("error", (err: any) => {
      if (err.code === "EADDRINUSE") {
        console.log(`Port ${port} already bound or in use, continuing...`);
      } else {
        console.error(`Server error on port ${port}:`, err);
      }
    });
    return server;
  }

  const server = listenOnPort(PORT);

  process.on("SIGTERM", () => {
    console.log("SIGTERM signal received: closing HTTP server gracefully.");
    server.close(() => {
      console.log("HTTP server closed.");
      process.exit(0);
    });
  });
  process.on("SIGINT", () => {
    console.log("SIGINT signal received: closing HTTP server gracefully.");
    server.close(() => {
      process.exit(0);
    });
  });
}

startServer();
