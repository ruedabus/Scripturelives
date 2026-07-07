import type { Metadata } from "next";
import {
  getCommunityStats, getPendingReports, getAllPostsAdmin,
  getBannedUsers, getRooms,
} from "@/lib/community";
import AdminCommunityClient from "./AdminCommunityClient";

export const metadata: Metadata = { title: "Community Moderation | Admin" };
export const dynamic = "force-dynamic";

export default async function AdminCommunityPage() {
  const [stats, reports, recentPosts, bannedUsers, rooms] = await Promise.all([
    getCommunityStats(),
    getPendingReports(),
    getAllPostsAdmin(30),
    getBannedUsers(),
    getRooms(),
  ]);

  return (
    <AdminCommunityClient
      stats={stats}
      reports={reports}
      recentPosts={recentPosts}
      bannedUsers={bannedUsers}
      rooms={rooms}
    />
  );
}
