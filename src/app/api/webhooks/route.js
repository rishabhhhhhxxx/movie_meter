// import { verifyWebhook } from "@clerk/nextjs/webhooks";
// import { createOrUpdateUser, deleteUser } from "@/lib/actions/user";
// import { clerkClient } from "@clerk/nextjs";

// export async function POST(req) {
//   try {
//     const evt = await verifyWebhook({
//       request: req,
//       secret: process.env.CLERK_WEBHOOK_SIGNING_SECRET,
//     });

//     const { id } = evt.data;
//     const eventType = evt.type;

//     if (eventType === "user.created" || eventType === "user.updated") {
//       const { first_name, last_name, image_url, email_addresses } = evt.data;

//       const user = await createOrUpdateUser(
//         id,
//         first_name,
//         last_name,
//         image_url,
//         email_addresses
//       );

//       if (user && eventType === "user.created") {
//         await clerkClient.users.updateUserMetadata(id, {
//           publicMetadata: {
//             userMongoId: user._id,
//           },
//         });
//       }
//     }

//     if (eventType === "user.deleted") {
//       await deleteUser(id);
//     }

//     return new Response("Webhook received", { status: 200 });
//   } catch (err) {
//     console.error("Error verifying webhook:", err);
//     return new Response("Error verifying webhook", { status: 400 });
//   }
// }
import { verifyWebhook } from "@clerk/nextjs/webhooks";
import { clerkClient } from "@clerk/nextjs";

// Optionally import your DB functions
import { createOrUpdateUser, deleteUser } from "@/lib/actions/user";

export async function POST(req) {
  try {
    const evt = await verifyWebhook({
      request: req,
      secret: process.env.CLERK_WEBHOOK_SIGNING_SECRET,
    });

    const eventType = evt.type;
    const { id, first_name, last_name, image_url, email_addresses } = evt.data;

    console.log(`📩 Webhook event received: ${eventType}`);
    console.log("📦 Payload:", evt.data);

    if (eventType === "user.created" || eventType === "user.updated") {
      const user = await createOrUpdateUser(
        id,
        first_name,
        last_name,
        image_url,
        email_addresses
      );

      if (user && eventType === "user.created") {
        await clerkClient.users.updateUserMetadata(id, {
          publicMetadata: {
            userMongoId: user._id,
          },
        });
      }
    }

    if (eventType === "user.deleted") {
      await deleteUser(id);
    }

    return new Response("✅ Webhook handled", { status: 200 });
  } catch (err) {
    console.error("❌ Webhook verification failed:", err);
    return new Response("Webhook error", { status: 400 });
  }
}
