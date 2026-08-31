import { Resend } from "resend";
import { env } from "../config/env";

const resend = new Resend(env.RESEND_API_KEY);

interface ContactEmailInput {
  name: string;
  email: string;
  subject?: string;
  message: string;
}

export const sendContactNotification = async (input: ContactEmailInput): Promise<void> => {
  const { name, email, subject, message } = input;
  const to = env.CONTACT_RECEIVER_EMAIL;

  if (!env.RESEND_API_KEY || !to || !env.EMAIL_FROM) {
    console.log("📧 [email fallback — Resend not fully configured] New contact message:");
    console.log({ name, email, subject, message });
    return;
  }

  const { error } = await resend.emails.send({
    from: env.EMAIL_FROM,
    to,
    replyTo: email, // when you click Reply in Gmail it goes to the visitor
    subject: `New portfolio message: ${subject || "No subject"}`,
    html: `
      <div style="font-family: sans-serif; line-height: 1.6;">
        <p><strong>From:</strong> ${name} (${email})</p>
        <p><strong>Subject:</strong> ${subject || "No subject"}</p>
        <hr />
        <p>${message.replace(/\n/g, "<br/>")}</p>
      </div>
    `,
  });

  if (error) {
    console.error("Contact notification failed:", error);
    throw new Error(error.message || "Failed to send contact notification");
  }
};

interface ReplyEmailInput {
  toName: string;
  toEmail: string;
  originalSubject?: string | null;
  replyBody: string;
}

export const sendReplyEmail = async (input: ReplyEmailInput): Promise<void> => {
  const { toName, toEmail, originalSubject, replyBody } = input;

  if (!env.RESEND_API_KEY || !env.EMAIL_FROM) {
    throw new Error(
      "Resend is not configured on the server (RESEND_API_KEY / EMAIL_FROM missing)."
    );
  }

  const subjectLine = originalSubject ? `Re: ${originalSubject}` : "Re: your message";

  const { error } = await resend.emails.send({
    from: env.EMAIL_FROM,
    to: toEmail,
    subject: subjectLine,
    html: `
      <div style="font-family: sans-serif; line-height: 1.6;">
        <p>Hi ${toName},</p>
        <p>${replyBody.replace(/\n/g, "<br/>")}</p>
        <br />
        <p>— Negaso Kena</p>
      </div>
    `,
  });

  if (error) {
    console.error("Reply email failed:", error);
    throw new Error(error.message || "Failed to send reply");
  }
};