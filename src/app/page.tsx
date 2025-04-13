"use client";
import { useState, useEffect } from "react";

import Dashboard from "@src/app/maindashboard/page";
const fetchData = () => {
  // Simulating fetching some stats data for the dashboard
  return {
    users: 5000,
    newUsers: 150,
    posts: 12000,
    newPosts: 50,
    activeUsers: 2000,
  };
};

type Data = {
  users: number;
  newUsers: number;
  posts: number;
  newPosts: number;
  activeUsers: number;
};

const fetchChartData = () => {
  // Simulating fetch for user engagement data (e.g., active users over time)
  return [
    { name: "Jan", users: 1200 },
    { name: "Feb", users: 1300 },
    { name: "Mar", users: 1400 },
    { name: "Apr", users: 1600 },
    { name: "May", users: 1800 },
    { name: "Jun", users: 2000 },
  ];
};

export default function Home() {
  const [stats, setStats] = useState<Data>();
  const [chartData, setChartData] = useState<
    {
      name: string;
      users: number;
    }[]
  >([]);
  const [loading, setLoading] = useState(true);
  

  useEffect(() => {
    console.log("Loading", loading);
    const data = fetchData();
    const chart = fetchChartData();
    setStats(data);
    console.log("Stats", stats);
    setChartData(chart);
    console.log("Chart", chartData);
    setLoading(false);
  }, []);

  return (
    <>
      <Dashboard />
    </>
  );
}
