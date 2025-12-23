"use server";

import { createClient } from "@/lib/supabase/server";
import { db } from "@/lib/db";
import { follows, posts, users, pets, comments } from "@/lib/db/schema";
import { eq, and, desc, inArray, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";

// 1. Follow User
export async function followUser(targetUserId: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false, error: "Unauthorized" };

    if (user.id === targetUserId) return { success: false, error: "Cannot follow yourself" };

    try {
        await db.insert(follows).values({
            followerId: user.id,
            followingId: targetUserId,
        });
        revalidatePath("/contest");
        revalidatePath("/profile");
        return { success: true };
    } catch (error) {
        console.error(error);
        return { success: false, error: "Failed to follow" };
    }
}

// 2. Unfollow User
export async function unfollowUser(targetUserId: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false, error: "Unauthorized" };

    try {
        await db.delete(follows)
            .where(and(
                eq(follows.followerId, user.id),
                eq(follows.followingId, targetUserId)
            ));
        revalidatePath("/contest");
        revalidatePath("/profile");
        return { success: true };
    } catch (error) {
        console.error(error);
        return { success: false, error: "Failed to unfollow" };
    }
}

// 3. Get Follow Status
export async function getIsFollowing(targetUserId: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;

    const result = await db.select()
        .from(follows)
        .where(and(
            eq(follows.followerId, user.id),
            eq(follows.followingId, targetUserId)
        ));

    return result.length > 0;
}

// 4. Get Feed (Posts from followed users)
// If not following anyone, return recommended or all (simple version: return recent posts)
export async function getFeed() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    let feedPosts;

    if (user) {
        // Find users I follow
        const myFollows = await db.select({ followingId: follows.followingId })
            .from(follows)
            .where(eq(follows.followerId, user.id));

        const followingIds = myFollows.map(f => f.followingId);

        if (followingIds.length > 0) {
            // Get posts from those users + my own
            feedPosts = await db.select({
                id: posts.id,
                imageUrl: posts.imageUrl,
                caption: posts.caption,
                likesCount: posts.likesCount,
                createdAt: posts.createdAt,
                petName: pets.petName,
                petImage: pets.profilePhotoUrl,
                ownerName: users.nickname,
                userId: users.id, // Needed for follow logic
            })
                .from(posts)
                .innerJoin(users, eq(posts.userId, users.id))
                .innerJoin(pets, eq(posts.petId, pets.id))
                .where(inArray(posts.userId, [...followingIds, user.id]))
                .orderBy(desc(posts.createdAt))
                .limit(20);
        }
    }

    // Fallback: If no user or no follows, return global recent posts
    if (!feedPosts || feedPosts.length === 0) {
        feedPosts = await db.select({
            id: posts.id,
            imageUrl: posts.imageUrl,
            caption: posts.caption,
            likesCount: posts.likesCount,
            createdAt: posts.createdAt,
            petName: pets.petName,
            petImage: pets.profilePhotoUrl,
            ownerName: users.nickname,
            userId: users.id,
        })
            .from(posts)
            .innerJoin(users, eq(posts.userId, users.id))
            .innerJoin(pets, eq(posts.petId, pets.id))
            .orderBy(desc(posts.createdAt))
            .limit(20);
    }

    return feedPosts;
}

// 5. Get User Profile with Grid Posts
export async function getProfileWithPosts(targetUserId: string) {
    // Fetch User & Main Pet
    const userInfo = await db.select()
        .from(users)
        .where(eq(users.id, targetUserId))
        .limit(1);

    if (!userInfo[0]) return null;

    // Fetch Pets
    const userPets = await db.select().from(pets).where(eq(pets.userId, targetUserId));

    // Fetch Posts (Grid)
    const userPosts = await db.select()
        .from(posts)
        .where(eq(posts.userId, targetUserId))
        .orderBy(desc(posts.createdAt));

    // Calculate Stats
    const followers = await db.select({ count: sql<number>`cast(count(*) as integer)` })
        .from(follows)
        .where(eq(follows.followingId, targetUserId));

    const following = await db.select({ count: sql<number>`cast(count(*) as integer)` })
        .from(follows)
        .where(eq(follows.followerId, targetUserId));

    return {
        user: userInfo[0],
        pets: userPets,
        posts: userPosts,
        stats: {
            followers: followers[0].count,
            following: following[0].count,
            postCount: userPosts.length
        }
    };
}

// 6. Create Post (Daily Log)
export async function createPost(petId: string, imageUrl: string, caption: string, type: 'DAILY' | 'CONTEST' = 'DAILY') {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false, error: "Unauthorized" };

    try {
        await db.insert(posts).values({
            userId: user.id,
            petId,
            imageUrl,
            caption,
            postType: type,
        });
        revalidatePath("/profile");
        revalidatePath("/"); // Update feed
        return { success: true };
    } catch (error) {
        console.error(error);
        return { success: false, error: "Failed to create post" };
    }
}
