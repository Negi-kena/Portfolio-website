import nodemailer from "nodemailer";
import { env } from "../config/env";

interface ContactEmailInput {
  name: string;
  email: string;
  subject?: string;
  message: string;
}

const smtpConfigured = Boolean(env.SMTP_HOST && env.SMTP_USER && env.SMTP_PASS);

const transporter = smtpConfigured
  ? nodemailer.createTransport({
      host: env.SMTP_HOST,
      port: Number(env.SMTP_PORT),
      secure: Number(env.SMTP_PORT) === 465,
      auth: { user: env.SMTP_USER, pass: env.SMTP_PASS },
    })
  : null;

export const sendContactNotification = async (input: ContactEmailInput): Promise<void> => {
  const { name, email, subject, message } = input;
  const to = env.CONTACT_RECEIVER_EMAIL || env.SMTP_USER;

  if (!transporter || !to) {
    // Graceful fallback so the contact form still "works" without SMTP configured
    console.log("📧 [email fallback — SMTP not configured] New contact message:");
    console.log({ name, email, subject, message });
    return;
  }

  await transporter.sendMail({
    from: `"Portfolio Contact Form" <${env.SMTP_USER}>`,
    to,
    replyTo: email,
    subject: `New portfolio message: ${subject || "No subject"}`,
    text: `From: ${name} <${email}>\n\n${message}`,
    html: `<p><strong>From:</strong> ${name} (${email})</p><p>${message.replace(/\n/g, "<br/>")}</p>`,
  });
};
