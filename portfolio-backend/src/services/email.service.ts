import { Resend } from "resend";
import { env } from "../config/env";

const resend = new Resend(env.RESEND_API_KEY);

interface ContactEmailInput {
  name: string;
  email: string;
  subject?: string;
  message: string;
}

/**
 * Notify you when a visitor submits the contact form
 */
export const sendContactNotification = async (
  input: ContactEmailInput
): Promise<void> => {
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
    replyTo: email,
    subject: `New portfolio message: ${subject || "No subject"}`,
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #1a1a1a;">
        <p><strong>From:</strong> ${name} (${email})</p>
        <p><strong>Subject:</strong> ${subject || "No subject"}</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 16px 0;" />
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

/**
 * Send a manual reply from the admin dashboard
 */
export const sendReplyEmail = async (input: ReplyEmailInput): Promise<void> => {
  const { toName, toEmail, originalSubject, replyBody } = input;

  if (!env.RESEND_API_KEY || !env.EMAIL_FROM) {
    throw new Error(
      "Resend is not configured on the server (RESEND_API_KEY / EMAIL_FROM missing)."
    );
  }

  const subjectLine = originalSubject
    ? `Re: ${originalSubject}`
    : "Re: your message";

  const { error } = await resend.emails.send({
    from: env.EMAIL_FROM,
    to: toEmail,
    subject: subjectLine,
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #1a1a1a;">
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

/**
 * Automatic confirmation email sent to the visitor
 */
export const sendAutoReply = async (data: {
  name: string;
  email: string;
}): Promise<void> => {
  if (!env.RESEND_API_KEY || !env.EMAIL_FROM) {
    console.log("Auto-reply skipped — Resend not configured");
    return;
  }

  const { error } = await resend.emails.send({
    from: env.EMAIL_FROM,
    to: data.email,
    subject: "Thanks for getting in touch",
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #1a1a1a; max-width: 560px; margin: 0 auto;">
        <p>Hi ${data.name},</p>

        <p>Thank you for reaching out. I've received your message and will review it shortly.</p>

        <p>I usually respond within 24-48 hours. If your inquiry is urgent, feel free to reply to this email.</p>

        <p style="margin-top: 28px;">
          Best regards,<br/>
          <strong>Negaso Kena</strong><br/>
          <span style="color: #666; font-size: 14px;">Full-Stack Developer</span>
        </p>
      </div>
    `,
  });

  if (error) {
    console.error("Auto-reply failed:", error);
    // Do not throw — auto-reply failure should never break the contact form
  }
};