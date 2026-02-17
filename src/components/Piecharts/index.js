"use client";
import React, { useEffect } from "react";
import { PieChart, Pie, Cell, Legend } from "recharts";

const COLORS = ["#C8187D", "#000080", "#3068b1"];
const RADIAN = Math.PI / 180;

const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
}) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor={x > cx ? "start" : "end"}
      dominantBaseline="central"
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

export default function App() {
  const [Projects, setProjects] = React.useState([]);
  const [Loading, setLoading] = React.useState(false);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${process.env.BASE_URL}/api/contractors/projects`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) throw new Error("Network response was not ok");
      const data = await response.json();
      setProjects(Array.isArray(data) ? data : []);
    } catch (err) {
      //console.error("Error fetching projects:", err);
      setProjects([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  // Transform Projects into PieChart data
  const pieData = React.useMemo(() => {
    const counts = Projects.reduce((acc, project) => {
      const key = project.status?.toLowerCase() || "unknown";
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});

    return Object.keys(counts).map((key) => ({
      name: key,
      value: counts[key],
    }));
  }, [Projects]);

  if (Loading) return <div>Loading...</div>;

  return (
    <div className="bg-white rounded-xl">
      <h2 className="text-black p-4 text-center font-bold">Job Status</h2>
      <PieChart width={350} height={350}>
        <Pie
          data={pieData}
          cx={180}
          cy={150}
          labelLine={false}
          label={renderCustomizedLabel}
          outerRadius={120}
          fill="#8884d8"
          dataKey="value"
        >
          {pieData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Legend
          align="right"
          verticalAlign="bottom"
          layout="vertical"
          iconType="circle"
          wrapperStyle={{ paddingTop: "10px" }}
        />
      </PieChart>
    </div>
  );
}
