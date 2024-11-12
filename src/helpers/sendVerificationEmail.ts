import { resend } from "@/lib/resend";
import VerificationEmail from "../../emails/VerificationEmail";
import { ApiResponse } from "@/types/ApiResponse";

export async function sendVerificationEmail(
  email: string,
  username: string,
  verifyCode: string
): Promise<ApiResponse> {
  try {
    await resend.emails.send({
      from: "sahil@sahilmane.me",
      to: email,
      subject: "Verify Your Email Address",
      react: VerificationEmail({ username, otp: verifyCode }),
    });
    return {
      success: true,
      message: "Verification Email Sent Successfully.",
    };
  } catch (emailError) {
    console.error("Error sending verification email.", emailError);
    return {
      success: false,
      message: "Error sending verification email.",
    };
  }
}
