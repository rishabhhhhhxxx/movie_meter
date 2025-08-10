// import { verifyWebhook } from "@clerk/nextjs/webhooks";
// import { clerkClient } from "@clerk/nextjs/server";
// import { createOrUpdateUser, deleteUser } from "@/lib/actions/user";
// export async function POST(req) {
//   try {
//     const evt = await verifyWebhook(req);

//     const { id } = evt.data;
//     const eventType = evt.type;
//     if (eventType === "user.created" || eventType === "user.updated") {
//       const { first_name, last_name, image_url, email_addresses } = evt?.data;
//       try {
//         const user = await createOrUpdateUser(
//           id,
//           first_name,
//           last_name,
//           image_url,
//           email_addresses
//         );
//         if (user && eventType === "user.created") {
//           try {
//             const client = await clerkClient();
//             await client.users.updateUserMetadata(id, {
//               publicMetadata: {
//                 userMongoId: user._id,
//               },
//             });
//           } catch (error) {
//             console.log("Error: Could not update user metadata:", error);
//           }
//         }
//       } catch (error) {
//         console.log("Error: Could not create or update user:", error);
//         return new Response("Error: Could not create or update user", {
//           status: 400,
//         });
//       }
//     }

//     if (eventType === "user.deleted") {
//       try {
//         await deleteUser(id);
//       } catch (error) {
//         console.log("Error: Could not delete user:", error);
//         return new Response("Error: Could not delete user", {
//           status: 400,
//         });
//       }
//     }
//     return new Response("Webhook received", { status: 200 });
//   } catch (err) {
//     console.error("Error verifying webhook:", err);
//     return new Response("Error verifying webhook", { status: 400 });
//   }
// } 

// import { Webhook } from 'svix';
// import { headers } from 'next/headers';
// import { clerkClient } from '@clerk/nextjs/server';
// import { NextResponse } from 'next/server';
// import { connect } from '@/lib/mongodb/mongoose';
// import User from '@/lib/models/user.model';

// export async function POST(req) {
//   const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SIGNING_SECRET;
//   console.log(WEBHOOK_SECRET);
//   if (!WEBHOOK_SECRET) {
//     throw new Error('Please add CLERK_WEBHOOK_SECRET from Clerk Dashboard to your .env file');
//   }

//   // Get the headers
//   const headerPayload = headers();
//   const svix_id = headerPayload.get("svix-id");
//   const svix_timestamp = headerPayload.get("svix-timestamp");
//   const svix_signature = headerPayload.get("svix-signature");

//   if (!svix_id || !svix_timestamp || !svix_signature) {
//     return new Response('Error: Missing required svix headers', { status: 400 });
//   }

//   // --- CRITICAL FIX ---
//   // Read the raw body as text FIRST. Do not parse as JSON yet.
//   const payload = await req.text();
//   // --- END OF FIX ---

//   const wh = new Webhook(WEBHOOK_SECRET);
//   let evt;

//   try {
//     // Verify the raw body payload against the headers
//     evt = wh.verify(payload, {
//       "svix-id": svix_id,
//       "svix-timestamp": svix_timestamp,
//       "svix-signature": svix_signature,
//     });
//   } catch (err) {
//     console.error('Error verifying webhook:', err.message);
//     return new Response('Error: Invalid webhook signature', { status: 400 });
//   }

//   // We have a verified event. Now we can safely work with it.
//   const eventType = evt.type;
  
//   if (eventType === 'user.created') {
//     // evt.data is already a parsed JSON object
//     const { id, email_addresses, image_url, first_name, last_name, username } = evt.data;

//     try {
//       await connect();
//       const newUser = await User.create({
//         clerkId: id,
//         email: email_addresses[0].email_address,
//         username: username || email_addresses[0].email_address.split('@')[0],
//         firstName: first_name,
//         lastName: last_name,
//         photo: image_url,
//       });

//       if (!newUser) {
//         throw new Error('Failed to create new user in database.');
//       }
      
//       await clerkClient.users.updateUserMetadata(id, {
//         publicMetadata: { userId: newUser._id.toString() },
//       });
      
//       return NextResponse.json({ message: 'User created successfully' });
//     } catch (error) {
//       console.error("CRITICAL ERROR in user.created handler:", error);
//       return new Response('Error: An internal error occurred while processing the user.', { status: 500 });
//     }
//   }

//   return new Response('', { status: 200 });
// }
import { verifyWebhook } from "@clerk/nextjs/webhooks";
import { clerkClient } from "@clerk/nextjs/server";
import { connect } from "@/lib/mongodb/mongoose";
import User from "@/lib/models/user.model";

// Update this path based on your app architecture
export async function POST(req) {
  try {
    const evt = await verifyWebhook({
      request: req,
      secret: process.env.CLERK_WEBHOOK_SIGNING_SECRET,
    });

    const { id: clerkId, first_name, last_name, image_url, email_addresses } = evt.data;
    const eventType = evt.type;

    await connect();

    if (eventType === "user.created" || eventType === "user.updated") {
      const email = email_addresses?.[0]?.email_address || "";

      const user = await User.findOneAndUpdate(
        { clerkId },
        {
          $set: {
            firstName: first_name,
            lastName: last_name,
            profilePicture: image_url,
            email,
          },
        },
        { upsert: true, new: true }
      );

      if (eventType === "user.created") {
        await clerkClient.users.updateUserMetadata(clerkId, {
          publicMetadata: { userMongoId: user._id.toString() },
        });
      }
    }

    if (eventType === "user.deleted") {
      await User.findOneAndDelete({ clerkId });
    }

    return new Response("Webhook processed", { status: 200 });
  } catch (error) {
    console.error("❌ Webhook error:", error);
    return new Response("Invalid webhook", { status: 400 });
  }
}
