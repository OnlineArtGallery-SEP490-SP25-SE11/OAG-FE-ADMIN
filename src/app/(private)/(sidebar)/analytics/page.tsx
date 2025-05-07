"use client";
import TabChart from "./components/tab-chart";

export default function AnalyticsPage() {
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
    </div>
  );
}
