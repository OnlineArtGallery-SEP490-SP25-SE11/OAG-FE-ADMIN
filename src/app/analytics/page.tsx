'use client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TopArtworks } from './components/top-artworks';
import { RecentSales } from './components/recent-sales';
import TabChart from './components/tab-chart';
import { vietnamCurrency } from '@/utils';

export default function AnalyticsPage() {
  // Sample data - replace with real data from your API


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

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <MetricCard
          title="Total Revenue"
          value={vietnamCurrency(4523000)}
          description="+20.1% from last month"
          trend="up"
        />
        <MetricCard
          title="Active Artists"
          value="234"
          description="+15% from last month"
          trend="up"
        />
        <MetricCard
          title="Total Artworks"
          value="1,892"
          description="+32 new this month"
          trend="up"
        />
        <MetricCard
          title="Active Galleries"
          value="156"
          description="+8 from last month"
          trend="up"
        />
      </div>
      <TabChart />

      {/* Bottom Section */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Top Performing Artworks</CardTitle>
          </CardHeader>
          <CardContent>
            <TopArtworks />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Recent Sales</CardTitle>
          </CardHeader>
          <CardContent>
            <RecentSales />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

interface MetricCardProps {
  title: string;
  value: string;
  description: string;
  trend: 'up' | 'down';
}

function MetricCard({ title, value, description, trend }: MetricCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className={`text-xs ${trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
          {description}
        </p>
      </CardContent>
    </Card>
  );
}