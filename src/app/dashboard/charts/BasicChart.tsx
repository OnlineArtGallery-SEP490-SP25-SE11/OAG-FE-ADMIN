"use client";

import ChartThree from "./ChartThree";
import React from "react";
import ChartFive from "./ChartFive";
import ChartOne from "./ChartOne";
import ChartTwo from "./ChartTwo";
import DataStatsOne from "./components/DataStatsOne";

const BasicChart: React.FC = () => {
  return (
    <div className="bg-gray-100 min-h-screen p-6">
      <div className="grid grid-cols-12 gap-6">
        {/* Phần tổng quan (4 card nhỏ) */}
        <div className="col-span-12 grid grid-cols-12 gap-6">
          <div className="col-span-12 sm:col-span-12 lg:col-span-12">
            <DataStatsOne />
          </div>
        </div>

        {/* Phần biểu đồ chính */}
        <div className="col-span-12 xl:col-span-7 bg-white rounded-xl shadow-lg p-6">
          <ChartOne />
        </div>
        <div className="col-span-12 xl:col-span-5 bg-white rounded-xl shadow-lg p-6">
          <ChartTwo />
        </div>

        {/* Phần dưới cùng với 2 biểu đồ */}
        <div className="col-span-12 xl:col-span-5 bg-white rounded-xl shadow-lg p-6">
          <ChartThree />
        </div>
        <div className="col-span-12 xl:col-span-7 bg-white rounded-xl shadow-lg p-6">
          <ChartFive />
        </div>
      </div>
    </div>
  );
};

export default BasicChart;
