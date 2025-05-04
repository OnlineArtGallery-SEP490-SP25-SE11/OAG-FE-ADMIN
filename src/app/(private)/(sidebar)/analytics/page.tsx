"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TopArtworks } from "./components/top-artworks";
import { RecentSales } from "./components/recent-sales";
import TabChart from "./components/tab-chart";
import { vietnamCurrency } from "@/utils";
import { useEffect, useState } from "react";
import {
  getAllUser,
  getAllArtwork,
  getAllGallery,
  getAllTransaction,
} from "@/service/analytics-service";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export default function AnalyticsPage() {
  const [artistCount, setArtistCount] = useState(0);
  const [artworkCount, setArtworkCount] = useState(0);
  const [galleryCount, setGalleryCount] = useState(0);
  const [commissionTotal, setCommissionTotal] = useState(0);
  const [transactionCount, setTransactionCount] = useState(0);

  useEffect(() => {
    async function fetchData() {
      try {
        const [
          userRes,
          artworkRes,
          galleryRes,
          transactionRes,
        ] = await Promise.all([
          getAllUser(),
          getAllArtwork(),
          getAllGallery(),
          getAllTransaction(),
        ]);

        // Đếm nghệ sĩ
        if (userRes?.data) {
          const artists = userRes.data.filter(
            (user: any) => user.role.includes("artist") && !user.isBanned
          );
          setArtistCount(artists.length);
        }

        // Đếm artwork
        if (artworkRes?.data?.artworks) {
          setArtworkCount(artworkRes.data.artworks.length);
        }

        // Đếm gallery
        if (galleryRes?.data?.pagination?.total !== undefined) {
          setGalleryCount(galleryRes.data.pagination.total);
        }

        // Tính COMMISSION
        if (transactionRes?.data) {
          const commissionTransactions = transactionRes.data.filter(
            (tx: any) => tx.type === "COMMISSION"
          );

          const total = commissionTransactions.reduce(
            (sum: number, tx: any) => sum + tx.amount,
            0
          );

          setCommissionTotal(parseFloat(total.toFixed(2)));
          setTransactionCount(commissionTransactions.length);
        }
      } catch (err) {
        console.error("Error loading analytics:", err);
      }
    }

    fetchData();
  }, []);

  const artistMetrics = [
    { month: "Jan", newArtists: 45, activeArtists: 120, totalArtworks: 350 },
    { month: "Feb", newArtists: 52, activeArtists: 145, totalArtworks: 425 },
    { month: "Mar", newArtists: 60, activeArtists: 160, totalArtworks: 500 },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
          Analytics Overview
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Detailed insights and performance metrics
        </p>
      </header>
      <TabChart />

      {/* Bottom Section */}
      {/* <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Top Performing Artworks</CardTitle>
          </CardHeader>
          <CardContent>
            <LineChart width={500} height={300} data={artistMetrics}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="newArtists" stroke="#8884d8" />
              <Line type="monotone" dataKey="activeArtists" stroke="#82ca9d" />
            </LineChart>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Transaction</CardTitle>
          </CardHeader>
          <CardContent>
            <RecentSales />
          </CardContent>
        </Card>
      </div> */}
    </div>
  );
}

interface MetricCardProps {
  title: string;
  value: string;
  description: string;
  trend: "up" | "down";
}

function MetricCard({ title, value, description, trend }: MetricCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p
          className={`text-xs ${
            trend === "up" ? "text-green-500" : "text-red-500"
          }`}
        >
          {description}
        </p>
      </CardContent>
    </Card>
  );
}
