import { google } from "googleapis";
import { User } from "../models/user.model.js";
import { refreshAccessToken } from "../utils/refershToken.js";
import { oAuth2Client } from "../config/googleOAuth.js";
import { GoogleGenerativeAI } from "@google/generative-ai";

const gmail = google.gmail("v1");
const genAI = new GoogleGenerativeAI(process.env.API_KEY);

const generateEmail = async (req, res) => {
  const { to, description } = req.body;
  const user = req.user

  if (!description || !to) {
    return res
      .status(400)
      .json({ error: "Job description and recipient email are required" });
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = `
            You are an expert email copywriter.

            Write a complete, short, and professional cold email to an HR with email ID: ${to}, applying for the job described below.

            Job Description:
            ${description}

            Candidate's Details:
            Name: ${user.name}
            Email: ${user.email}
            College: ${user.college}
            Education: ${user.education}
            Years of Experience: ${user.yearOfExp}
            Skills: ${user.skills.join(", ")}
            LinkedIn: ${user.linkedInUrl}
            Resume: ${user.resumeUrl}

            Instructions:
            - Begin the email with "Dear Hiring Manager," (avoid using the email ID directly)
            - Keep the tone polite, enthusiastic, and under 150 words
            - Mention relevant skills clearly
            - Naturally mention the LinkedIn and Resume URLs using text like "my LinkedIn profile" and "my resume" (avoid pasting full long URLs directly)
            - Do NOT include markdown syntax like **bold** or any additional summary
            - Do NOT return any extra lines outside the subject and body
            - You are not restricted to use the exact data provided, you can make some tweaks of your own to make the email more engaging
            - Return the response in this exact format:

            Subject: [Your subject line here]
            Body: [The complete email body here]
            `;


    const response = await model.generateContent([prompt]);
    console.log(response);
    const text = response.response.candidates[0].content.parts[0].text;

    // Simple regex separation (can improve later)
    const subjectMatch = text.match(/Subject:(.*)/i);
    const subject = subjectMatch ? subjectMatch[1].trim() : "Job Application";
    const body = text.replace(/Subject:.*\n?/i, "").trim();

    res.json({ subject, body });
  } catch (error) {
    console.error("Email generation error", error);
    res.status(500).json({ error: "Failed to generate email" });
  }
};

const sendEmail = async (req, res) => {
  const { to, subject, body } = req.body;
  const user = req.user;
  let accessToken = user.accessToken;

  try {
    const rawEmail = Buffer.from(
      `To: ${to}\r\n` +
        `Subject: ${subject}\r\n` +
        `Content-Type: text/plain; charset="UTF-8"\r\n\r\n` +
        `${body}`
    )
      .toString("base64")
      .replace(/\+/g, "-")
      .replace(/\//g, "_");

    const auth = oAuth2Client;
    auth.setCredentials({ access_token: accessToken });

    await gmail.users.messages.send({
      userId: "me",
      auth: auth,
      requestBody: {
        raw: rawEmail,
      },
    });

    return res.json({ message: "Email sent successfully", status: "success" });
  } catch (error) {
    if (error.response && error.response.status === 401) {
      console.log("Access token expired, refreshing...");

      accessToken = await refreshAccessToken(user._id, user.refreshToken);

      if (accessToken) {
        return sendEmail(req, res);
      } else {
        return res
          .status(401)
          .json({ error: "Failed to refresh access token" });
      }
    }
    console.error("Email sending error:", error);
    return res.status(500).json({ error: "Failed to send email" });
  }
};

export { sendEmail, generateEmail };
