import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import PlanDetailClient from "./PlanDetailClient";

export default async function PlanDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  return <PlanDetailClient planId={params.id} />;
}

