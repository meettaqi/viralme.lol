"use server";

import { updateSettings } from "@/lib/settings";
import { deleteBid } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function updateSettingsAction(formData: FormData) {
  const password = formData.get("password");
  
  if (password !== process.env.ADMIN_PASSWORD) {
    throw new Error("Invalid password");
  }

  const takeoverEnabled = formData.get("takeoverEnabled") === "on";
  const takeoverDurationHours = parseFloat(formData.get("takeoverDurationHours") as string);
  const takeoverMultiplier = parseFloat(formData.get("takeoverMultiplier") as string);

  await updateSettings({
    takeoverEnabled,
    takeoverDurationHours,
    takeoverMultiplier,
  });

  revalidatePath("/");
  revalidatePath("/admin");
  redirect("/admin?success=1");
}


export async function deleteBidAction(formData: FormData) {
  const password = formData.get("password");
  if (password !== process.env.ADMIN_PASSWORD) {
    throw new Error("Invalid password");
  }
  
  const bidId = formData.get("bidId") as string;
  if (bidId) {
    await deleteBid(bidId);
  }
  
  revalidatePath("/");
  revalidatePath("/admin");
}
