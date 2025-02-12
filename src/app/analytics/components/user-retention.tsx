'use client';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { cohort: 'Week 1', retention: 100 },
  { cohort: 'Week 2', retention: 85 },
  { cohort: 'Week 3', retention: 70 },
  { cohort: 'Week 4', retention: 65 },
  { cohort: 'Week 5', retention: 55 },
];

export function UserRetention() {
  return (
    <div className="h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="cohort" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="retention" fill="#82ca9d" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
} 