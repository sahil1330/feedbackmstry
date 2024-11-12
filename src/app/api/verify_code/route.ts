/* eslint-disable @typescript-eslint/no-explicit-any */
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User.model";

export async function POST(request: Request) {
  await dbConnect();
  try {
    const { username, code } = await request.json();
    const decodedUsername = decodeURIComponent(username);
    const user = await UserModel.findOne({
      username: decodedUsername,
    });
    if (!user) {
      return Response.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 404 }
      );
    }
    if (user.verifyCode !== code) {
      return Response.json(
        {
          success: false,
          message: "Incorrect verification code",
        },
        { status: 400 }
      );
    }
    if (user.verifyCodeExpiry < new Date()) {
      return Response.json(
        {
          success: false,
          message:
            "Verification Code is expired. Please sign up again to get a new code",
        },
        { status: 400 }
      );
    }
    user.isVerified = true;
    await user.save();
    return Response.json(
      {
        success: true,
        message: "User verified",
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error Verifying User", error);
    return Response.json(
      {
        success: false,
        message: "Error verifying user: " + error.message,
      },
      { status: 500 }
    );
  }
}
