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
// src/app/api/webhooks/route.js (Corrected Version)

import { Webhook } from 'svix';
import { headers } from 'next/headers';
import { clerkClient } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { connect } from '@/lib/mongodb/mongoose';
import User from '@/lib/models/user.model';

export async function POST(req) {
  // You can find this in the Clerk Dashboard -> Webhooks -> choose the webhook
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    throw new Error('Please add CLERK_WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local');
  }

  // Get the headers
  const headerPayload = headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Error occured -- no svix headers', {
      status: 400
    });
  }

  // Get the body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  // Create a new Svix instance with your secret.
  const wh = new Webhook(WEBHOOK_SECRET);
  let evt;

  // Verify the payload with the headers
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    });
  } catch (err) {
    console.error('Error verifying webhook:', err);
    return new Response('Error occured', {
      status: 400
    });
  }

  // Get the type of event
  const eventType = evt.type;

  // --- THIS IS THE CORE LOGIC ---
  if (eventType === 'user.created') {
    const { id, email_addresses, image_url, first_name, last_name, username } = evt.data;

    try {
      await connect();

      const newUser = await User.create({
        clerkId: id,
        email: email_addresses[0].email_address,
        username: username || email_addresses[0].email_address.split('@')[0],
        firstName: first_name,
        lastName: last_name,
        photo: image_url,
      });

      // Update Clerk user's metadata with the new MongoDB user ID
      if (newUser) {
        // --- THIS IS THE FIX ---
        // We use clerkClient directly. No `await clerkClient()`
        await clerkClient.users.updateUserMetadata(id, {
          publicMetadata: {
            // We'll use 'userId' as the key. Make sure your favorites feature reads this key.
            userId: newUser._id.toString(), 
          },
        });
      }

      return NextResponse.json({ message: 'New user created and metadata updated', user: newUser });
    } catch (error) {
      console.error("Error creating new user in MongoDB:", error);
      return new Response('Error occured while creating user', { status: 500 });
    }
  }
  
  // You can add logic for 'user.updated' or 'user.deleted' here if needed

  console.log(`Webhook with an unhandled event type: ${eventType}`);
  return new Response('', { status: 200 });
}