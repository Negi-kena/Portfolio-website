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

interface ReplyEmailInput {
  toName: string;
  toEmail: string;
  originalSubject?: string | null;
  replyBody: string;
}

// Sends the admin's reply directly to the lead's inbox, from your own
// configured address — no mailto:/external mail client involved.
export const sendReplyEmail = async (input: ReplyEmailInput): Promise<void> => {
  const { toName, toEmail, originalSubject, replyBody } = input;

  if (!transporter) {
    throw new Error(
      "SMTP is not configured on the server (SMTP_HOST/SMTP_USER/SMTP_PASS), so in-app replies can't be sent yet."
    );
  }

  const subjectLine = originalSubject ? `Re: ${originalSubject}` : "Re: your message";

  await transporter.sendMail({
    from: `"${env.CONTACT_RECEIVER_EMAIL ? "Negaso Kena" : env.SMTP_USER}" <${env.SMTP_USER}>`,
    to: `"${toName}" <${toEmail}>`,
    replyTo: env.CONTACT_RECEIVER_EMAIL || env.SMTP_USER,
    subject: subjectLine,
    text: replyBody,
    html: `<p>${replyBody.replace(/\n/g, "<br/>")}</p>`,
  });
};