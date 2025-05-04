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
import {
  getAllUser,
  getAllArtwork,
  getAllExhibitiion,
} from "@/service/analytics-service";
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
  const [exhibitions, setExhibitions] = useState<any[]>([]);

  useEffect(() => {
    async function fetchExhibitions() {
      try {
        const res = await getAllExhibitiion();
        if (res?.data?.exhibitions) {
          setExhibitions(res.data.exhibitions);
        }
      } catch (error) {
        console.error("Error fetching exhibitions:", error);
      }
    }

    fetchExhibitions();
  }, []);

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
      </TabsList>

      <TabsContent value="artists">
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader></CardHeader>
            <CardContent>
              <TopArtworks />
            </CardContent>
          </Card>

          <Card>
            <CardHeader></CardHeader>
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

          <Card>
            <CardHeader>
              <CardTitle>Exhibition Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {exhibitions.map((exhibition) => (
                  <div key={exhibition._id} className="space-y-2">
                    <div className="font-medium text-lg">
                      {exhibition.contents?.[0]?.name || "Untitled"}
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <div className="text-gray-500">Visitors</div>
                        <div className="font-medium">
                          {exhibition.result?.visits ?? 0}
                        </div>
                      </div>
                      <div>
                        <div className="text-gray-500">Total Time</div>
                        <div className="font-medium">
                          {Math.round((exhibition.result?.totalTime ?? 0) / 60)}{" "}
                          mins
                        </div>
                      </div>
                      <div>
                        <div className="text-gray-500">Likes</div>
                        <div className="font-medium text-yellow-500">
                          ★ {exhibition.result?.likes?.length ?? 0}
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
    </Tabs>
  );
}
