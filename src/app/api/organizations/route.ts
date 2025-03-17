import { NextResponse } from "next/server";
import axios from "axios";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

export async function GET() {
  const { isAuthenticated } = getKindeServerSession();

  if (!(await isAuthenticated())) {
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    const kindeApiKey = process.env.KINDE_MANAGEMENT_API_KEY;

    if (!kindeApiKey) {
      return NextResponse.json(
        { error: "Management API key not configured" },
        { status: 500 }
      );
    }

    const response = await axios.get(
      `${process.env.KINDE_ISSUER_URL}/api/v1/organizations`,
      {
        headers: {
          Authorization: `Bearer ${kindeApiKey}`,
          Accept: "application/json",
        },
      }
    );

    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error("Error fetching organizations:", error.response?.data || error.message);
    return NextResponse.json(
      {
        error: "Failed to fetch organizations",
        details: error.response?.data || error.message,
      },
      { status: error.response?.status || 500 }
    );
  }
}