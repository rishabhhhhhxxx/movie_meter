import { verifyWebhook } from "@clerk/nextjs/webhooks";
import { createOrUpdateUser, deleteUser } from "@/lib/actions/user";
import { clerkClient } from "@clerk/nextjs";

export async function POST(req) {
  try {
    const evt = await verifyWebhook(req, {
      signingSecret: process.env.CLERK_WEBHOOK_SIGNING_SECRET,
    });

    console.log("✅ Webhook verified:", evt.type);

    const { id, first_name, last_name, image_url, email_addresses } = evt.data;
    const eventType = evt.type;

    if (["user.created", "user.updated"].includes(eventType)) {
      const user = await createOrUpdateUser(
        id,
        first_name,
        last_name,
        image_url,
        email_addresses
      );
      if (user && eventType === "user.created") {
        await clerkClient.users.updateUserMetadata(id, {
          publicMetadata: { userMongoId: user._id },
        });
      }
    } else if (eventType === "user.deleted") {
      await deleteUser(id);
    }

    return new Response("Webhook received", { status: 200 });
  } catch (err) {
    console.error("❌ Webhook verification failed:", err);
    console.log("🧾 Headers:", Object.fromEntries(req.headers.entries()));
    return new Response("Webhook error", { status: 400 });
  }
}
