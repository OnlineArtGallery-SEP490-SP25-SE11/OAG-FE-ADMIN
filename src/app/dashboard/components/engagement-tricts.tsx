'use client';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Week 1', comments: 400, likes: 240, shares: 100 },
  { name: 'Week 2', comments: 300, likes: 139, shares: 80 },
  { name: 'Week 3', comments: 200, likes: 980, shares: 200 },
  { name: 'Week 4', comments: 278, likes: 390, shares: 208 },
];

export function EngagementMetrics() {
  return (
    <div className="h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="comments" stroke="#8884d8" />
          <Line type="monotone" dataKey="likes" stroke="#82ca9d" />
          <Line type="monotone" dataKey="shares" stroke="#ffc658" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}