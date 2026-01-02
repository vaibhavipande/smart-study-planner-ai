import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export interface CurrentUser {
  id: string;
  name: string;
  email: string;
}

export async function getCurrentUser(): Promise<CurrentUser | null> {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id || !session?.user?.name || !session?.user?.email) {
      return null;
    }

    return {
      id: session.user.id,
      name: session.user.name,
      email: session.user.email,
    };
  } catch (error) {
    console.error("Error getting current user:", error);
    return null;
  }
}
