"use client";

import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  LineChart,
  BarChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { getAllUser, getAllArtwork } from "@/service/analytics-service";
import { TopArtworks } from "./top-artworks";

interface Artist {
  _id: string;
  name: string;
  image: string;
  followers: string[];
  artworks: number;
  revenue: number;
}

export default function TabChart() {
  const [topArtists, setTopArtists] = useState<Artist[]>([]);
  const [sortMetric, setSortMetric] = useState<"followers" | "artworks">(
    "followers"
  );

  const artistMetrics = [
    { month: "Jan", newArtists: 45, activeArtists: 120, totalArtworks: 350 },
    { month: "Feb", newArtists: 52, activeArtists: 145, totalArtworks: 425 },
    { month: "Mar", newArtists: 60, activeArtists: 160, totalArtworks: 500 },
  ];

  const exhibitionMetrics = [
    {
      month: "Jan",
      exhibition: "Modern Showcase",
      visitors: 12500,
      avgDuration: 45,
      rating: 4.8,
    },
    {
      month: "Feb",
      exhibition: "Digital Festival",
      visitors: 8900,
      avgDuration: 38,
      rating: 4.6,
    },
    {
      month: "Mar",
      exhibition: "Contemporary Masters",
      visitors: 15600,
      avgDuration: 52,
      rating: 4.9,
    },
  ];

  const recentActivities = [
    { id: 1, activity: "Artwork Upload", time: "5 minutes ago" },
    { id: 2, activity: "New Comment", time: "15 minutes ago" },
    { id: 3, activity: "Collection Created", time: "30 minutes ago" },
    { id: 4, activity: "Gallery Visit", time: "45 minutes ago" },
    { id: 5, activity: "Artwork Purchase", time: "1 hour ago" },
  ];

  useEffect(() => {
    async function fetchTopArtists() {
      try {
        const [userRes, artworkRes] = await Promise.all([
          getAllUser(),
          getAllArtwork(),
        ]);

        if (userRes?.data && artworkRes?.data?.artworks) {
          const artworks = artworkRes.data.artworks;
          const artists = userRes.data.filter(
            (user: any) => user.role.includes("artist") && !user.isBanned
          );

          const artistWithArtworkCount = artists.map((artist: any) => {
            const artistArtworks = artworks.filter(
              (artwork: any) => artwork.artistId?._id === artist._id
            );
            return {
              _id: artist._id,
              name: artist.name,
              image: artist.image,
              followers: artist.followers || [],
              artworks: artistArtworks.length,
              revenue: artist.revenue || 0,
            };
          });

          const sorted = artistWithArtworkCount
            .sort((a: Artist, b: Artist) => {
              if (sortMetric === "followers") {
                return b.followers.length - a.followers.length;
              } else {
                return b.artworks - a.artworks;
              }
            })
            .slice(0, 5);

          setTopArtists(sorted);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    fetchTopArtists();
  }, [sortMetric]);

  return (
    <Tabs defaultValue="artists" className="mb-8">
      <TabsList>
        <TabsTrigger value="artists">Artist Analytics</TabsTrigger>
        <TabsTrigger value="exhibitions">Exhibition Analytics</TabsTrigger>
        <TabsTrigger value="engagement">User Engagement</TabsTrigger>
      </TabsList>

      <TabsContent value="artists">
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader></CardHeader>
            <CardContent>
              <TopArtworks />
            </CardContent>
          </Card>

          {/* Top Artists Card */}
          <Card>
            <CardHeader></CardHeader>
            {/* Filter Dropdown */}
            <div className="flex items-center justify-between mb-6">
              <p className="text-xl font-semibold mx-6">Top Artist</p>
              <div className="flex items-center space-x-4 mx-6">
                <label className="text-sm text-muted-foreground">
                  Sort by:
                </label>
                <select
                  value={sortMetric}
                  onChange={(e) =>
                    setSortMetric(e.target.value as "followers" | "artworks")
                  }
                  className="text-sm text-emerald-700 dark:text-emerald-200 bg-transparent border border-emerald-300 dark:border-emerald-600 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-emerald-400 dark:focus:ring-emerald-600"
                >
                  <option value="followers">Followers</option>
                  <option value="artworks">Artworks</option>
                </select>
              </div>
            </div>
            <CardContent>
              <div className="space-y-4">
                {topArtists.map((artist) => (
                  <div
                    key={artist._id}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-4">
                      <img
                        src={artist.image}
                        alt={artist.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div>
                        <div className="font-medium">{artist.name}</div>
                        {/* <div className="text-sm text-gray-500">
                          {artist.followers.length} followers
                        </div> */}
                      </div>
                    </div>
                    <div className="text-right text-sm">
                      <div className="text-gray-600">
                        {artist.artworks} artworks
                      </div>
                      <div className="text-gray-400">
                        {artist.followers.length} followers
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </TabsContent>

      <TabsContent value="exhibitions">
        <div className="grid gap-6 md:grid-cols-2">
          {/* Exhibition Visitors Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Most Visited Exhibitions</CardTitle>
            </CardHeader>
            <CardContent>
              <BarChart width={500} height={300} data={exhibitionMetrics}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="exhibition" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="visitors" fill="#8884d8" name="Visitors" />
              </BarChart>
            </CardContent>
          </Card>

          {/* Exhibition Statistics */}
          <Card>
            <CardHeader>
              <CardTitle>Exhibition Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {exhibitionMetrics.map((metric) => (
                  <div key={metric.month} className="space-y-2">
                    <div className="font-medium text-lg">
                      {metric.exhibition}
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <div className="text-gray-500">Visitors</div>
                        <div className="font-medium">
                          {metric.visitors.toLocaleString()}
                        </div>
                      </div>
                      <div>
                        <div className="text-gray-500">Avg. Duration</div>
                        <div className="font-medium">
                          {metric.avgDuration} mins
                        </div>
                      </div>
                      <div>
                        <div className="text-gray-500">Rating</div>
                        <div className="font-medium text-yellow-500">
                          ★ {metric.rating}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </TabsContent>

      <TabsContent value="engagement">
        <div className="grid gap-6 md:grid-cols-2">
          {/* User Engagement Metrics */}
          <Card>
            <CardHeader>
              <CardTitle>User Engagement</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>Artwork Interactions</span>
                  <span className="font-medium">2,453 today</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Comments Posted</span>
                  <span className="font-medium">342 today</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>New Collections Created</span>
                  <span className="font-medium">89 today</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* User Activity Timeline */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-4">
                    <div className="w-2 h-2 mt-2 rounded-full bg-blue-500" />
                    <div>
                      <div className="font-medium">{activity.activity}</div>
                      <div className="text-sm text-gray-500">
                        {activity.time}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </TabsContent>
    </Tabs>
  );
}
