"use client";

import React, { useState, useEffect } from "react";
import { AnimatedTooltip } from "@/components/ui/animated-tooltip";
import Link from "next/link";
import {
  Chart as ChartJS,
  RadialLinearScale,
  ArcElement,
  PointElement,
  BubbleController,
  Tooltip,
  Legend,
  LinearScale,
} from "chart.js";
import { PolarArea, Bubble } from "react-chartjs-2";
import { createRoot } from "react-dom/client";
import { FloatingBubbles } from "@/components/ui/floating-bubbles";
import { TimelineChart } from "@/components/ui/timeline-chart";
import { Inter } from "next/font/google";

ChartJS.register(
  RadialLinearScale,
  ArcElement,
  PointElement,
  BubbleController,
  Tooltip,
  Legend,
  LinearScale
);

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

const people = [
  {
    id: 1,
    name: "aly",
    suggested_color: "Yellow",
    color_matches: {
      Yellow: 60,
      Blue: 20,
      Red: 10,
      Green: 10,
    },
    pos_traits: ["Happiness", "Optimism", "Creativity"],
    neg_traits: ["Impulsive", "Scattered"],
    keywords: ["energy", "communication", "happiness"],
    interactions: [
      {
        date: "2025-04-01",
        dominantColor: "Yellow",
        wordCount: 100,
        color_matches: {
          Yellow: 60,
          Blue: 20,
          Red: 10,
          Green: 10,
        },
      },
    ],
    stats: {
      totalInteractions: 1,
      lastMessage: "2025-04-01",
      avgWordsPerSession: 100,
      colorShifts: 0,
      colorTimeline: "Yellow",
    },
  },
  {
    id: 2,
    name: "tomster",
    suggested_color: "Green",
    color_matches: {
      Yellow: 20,
      Blue: 10,
      Red: 10,
      Green: 60,
    },
    pos_traits: ["Calm", "Growth", "Balance"],
    neg_traits: ["Indecisive"],
    keywords: ["harmony"],
    interactions: [
      {
        date: "2024-01-15",
        dominantColor: "Yellow",
        wordCount: 120,
        color_matches: {
          Yellow: 60,
          Blue: 20,
          Red: 10,
          Green: 10,
        },
      },
      {
        date: "2024-02-10",
        dominantColor: "Yellow",
        wordCount: 120,
        color_matches: {
          Yellow: 60,
          Blue: 20,
          Red: 10,
          Green: 10,
        },
      },
      {
        date: "2024-04-14",
        dominantColor: "Green",
        wordCount: 100,
        color_matches: {
          Yellow: 20,
          Blue: 10,
          Red: 10,
          Green: 60,
        },
      },
    ],
    stats: {
      totalInteractions: 3,
      lastMessage: "2024-04-14",
      avgWordsPerSession: 120,
      colorShifts: 2,
      colorTimeline: "Yellow → Green",
    },
  },
  {
    id: 3,
    name: "kevin",
    suggested_color: "Red",
    color_matches: {
      Yellow: 10,
      Blue: 20,
      Red: 60,
      Green: 10,
    },
    pos_traits: ["Leadership", "Action", "Confidence"],
    neg_traits: ["Aggressive", "Impatient", "Dominant"],
    keywords: ["power", "drive"],
  },
  {
    id: 4,
    name: "trevor",
    suggested_color: "Blue",
    color_matches: {
      Yellow: 10,
      Blue: 60,
      Red: 20,
      Green: 10,
    },
    pos_traits: ["Trust", "Depth", "Loyalty"],
    neg_traits: ["Withdrawn", "Overcautious"],
    keywords: ["stability", "peace"],
  },
];

const polarData = {
  labels: ["Yellow", "Blue", "Red", "Green"],
  datasets: [
    {
      label: "Color Distribution",
      data: people
        .filter((p) => p.color_matches) // do we only include people with color_matches ?
        .map((p) => [
          p.color_matches.Yellow || 0,
          p.color_matches.Blue || 0,
          p.color_matches.Red || 0,
          p.color_matches.Green || 0,
        ])
        .reduce(
          (acc, curr) => curr.map((num, idx) => (acc[idx] || 0) + num),
          [0, 0, 0, 0]
        ),
      backgroundColor: [
        "rgba(255, 206, 86, 0.5)",
        "rgba(54, 162, 235, 0.5)",
        "rgba(255, 99, 132, 0.5)",
        "rgba(75, 192, 192, 0.5)",
      ],
      borderWidth: 1,
    },
  ],
};

const bubbleData = {
  datasets: [
    {
      label: "Color Traits",
      data: [
        { x: 20, y: 30, r: 15 },
        { x: 40, y: 10, r: 10 },
        { x: 15, y: 50, r: 20 },
      ],
      backgroundColor: "rgba(255, 99, 132, 0.5)",
    },
  ],
};

const axisOptions = {
  "expressiveness-diversity": {
    xLabel: "Expressiveness",
    yLabel: "Trait Diversity",
    computeXY: (person) => ({
      x: person.color_matches.Yellow || 0,
      y: person.pos_traits.length + person.neg_traits.length,
      r: 15,
    }),
  },
  "openness-authority": {
    xLabel: "Emotional Openness",
    yLabel: "Authority Score",
    computeXY: (person) => ({
      x: person.color_matches.Blue || 0,
      y: person.color_matches.Red || 0,
      r: 15,
    }),
  },
  "positive-negative": {
    xLabel: "Positive Trait Match %",
    yLabel: "Negative Trait Match %",
    computeXY: (person) => ({
      x: person.pos_traits.length * 20,
      y: person.neg_traits.length * 20,
      r: 15,
    }),
  },
};

const CustomTooltip = ({ person }) => (
  <div className="bg-white p-4 rounded-lg shadow-lg">
    <div className="font-bold text-lg mb-2">
      {person.name} - {person.suggested_color}
    </div>
    <div className="mb-2">
      <div className="font-semibold">Color Matches:</div>
      {Object.entries(person.color_matches).map(([color, percentage]) => (
        <div key={color} className="flex justify-between">
          <span>{color}:</span>
          <span>{percentage}%</span>
        </div>
      ))}
    </div>
    <div className="mb-2">
      <div className="font-semibold">Positive Traits:</div>
      <div>{person.pos_traits.join(", ")}</div>
    </div>
    {person.neg_traits.length > 0 && (
      <div className="mb-2">
        <div className="font-semibold">Negative Traits:</div>
        <div>{person.neg_traits.join(", ")}</div>
      </div>
    )}
    <div>
      <div className="font-semibold">Keywords:</div>
      <div>{person.keywords.join(", ")}</div>
    </div>
  </div>
);

const chartOptions = {
  plugins: {
    tooltip: {
      enabled: false,
      external: function (context) {
        let tooltipEl = document.getElementById("chartjs-tooltip");

        if (!tooltipEl) {
          tooltipEl = document.createElement("div");
          tooltipEl.id = "chartjs-tooltip";
          tooltipEl.innerHTML = "<div></div>";
          document.body.appendChild(tooltipEl);
          const root = createRoot(tooltipEl.querySelector("div"));
          tooltipEl.root = root;
        }

        const tooltipModel = context.tooltip;
        if (tooltipModel.opacity === 0) {
          tooltipEl.style.opacity = 0;
          return;
        }

        if (tooltipModel.dataPoints && tooltipModel.dataPoints.length) {
          const dataPoint = tooltipModel.dataPoints[0];
          const person = people[dataPoint.dataIndex];

          if (person) {
            tooltipEl.root.render(<CustomTooltip person={person} />);
          }

          const position = context.chart.canvas.getBoundingClientRect();
          const bodyFont = context.chart.options.font;

          tooltipEl.style.opacity = 1;
          tooltipEl.style.position = "absolute";
          tooltipEl.style.left =
            position.left + window.pageXOffset + dataPoint.element.x + "px";
          tooltipEl.style.top =
            position.top + window.pageYOffset + dataPoint.element.y + "px";
          tooltipEl.style.font = bodyFont;
          tooltipEl.style.padding =
            tooltipModel.padding + "px " + tooltipModel.padding + "px";
          tooltipEl.style.pointerEvents = "none";
          tooltipEl.style.transform = "translate(-50%, -100%)";
          tooltipEl.style.transition = "all .1s ease";
          tooltipEl.style.zIndex = 1000;
        }
      },
    },
    legend: {
      display: true,
    },
  },
};

const tooltipStyles = `
  #chartjs-tooltip {
    background: white;
    border-radius: 0.5rem;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    padding: 8px;
    min-width: 200px;
  }
`;

const colorMap = {
  Yellow: "rgba(255, 206, 86, 0.5)",
  Blue: "rgba(54, 162, 235, 0.5)",
  Red: "rgba(255, 99, 132, 0.5)",
  Green: "rgba(75, 192, 192, 0.5)",
  Orange: "rgba(255, 198, 140, 1)",
  Gray: "rgba(200, 200, 200, 1)",
  Black: "rgba(0, 0, 0, 0.5)",
  Pink: "rgba(255, 182, 193, 0.5)",
  Purple: "rgba(147, 112, 219, 0.5)",
  White: "rgba(255, 255, 255, 0.5)",
};

const PersonalityCard = ({ person }) => {
  if (!person) return null;

  const baseColor = colorMap[person.suggested_color] || colorMap.Gray;

  const backgroundColor = baseColor.replace("0.5", "0.4");

  return (
    <div
      className="rounded-lg p-6 shadow-lg"
      style={{
        backgroundColor: backgroundColor,
        backdropFilter: "blur(8px)",
      }}
    >
      <h2 className="text-xl font-bold mb-4">{person.name}</h2>

      {/* Traits Section */}
      <div className="mb-4">
        <h3 className="font-semibold mb-2">Positive Traits</h3>
        <div className="flex flex-wrap gap-2">
          {person.pos_traits.map((trait, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-white/50 rounded-full text-sm"
            >
              {trait}
            </span>
          ))}
        </div>
      </div>

      <div className="mb-4">
        <h3 className="font-semibold mb-2">Negative Traits</h3>
        <div className="flex flex-wrap gap-2">
          {person.neg_traits.map((trait, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-white/50 rounded-full text-sm"
            >
              {trait}
            </span>
          ))}
        </div>
      </div>

      {/* Color Distribution */}
      <div className="mb-4">
        <h3 className="font-semibold mb-2">Color Distribution</h3>
        {Object.entries(person.color_matches).map(([color, percentage]) => (
          <div key={color} className="flex items-center gap-2 mb-1">
            <span className="text-sm">{color}:</span>
            <div className="flex-1 h-2 bg-white/30 rounded-full overflow-hidden">
              <div
                className="h-full bg-white/50 rounded-full"
                style={{ width: `${percentage}%` }}
              />
            </div>
            <span className="text-sm">{percentage}%</span>
          </div>
        ))}
      </div>

      {/* Stats Section*/}
      {person.stats && (
        <div className="mt-4 pt-4 border-t border-white/30">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm opacity-75">Total Interactions</p>
              <p className="font-semibold">{person.stats.totalInteractions}</p>
            </div>
            <div>
              <p className="text-sm opacity-75">Last Interaction</p>
              <p className="font-semibold">{person.stats.lastMessage}</p>
            </div>
            <div>
              <p className="text-sm opacity-75">Avg Words/Session</p>
              <p className="font-semibold">{person.stats.avgWordsPerSession}</p>
            </div>
            <div>
              <p className="text-sm opacity-75">Color Shifts</p>
              <p className="font-semibold">{person.stats.colorShifts}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default function AnimatedTooltipPreview() {
  const [question, setQuestion] = useState("");
  const [isClient, setIsClient] = useState(false);
  const [axisMode, setAxisMode] = useState("expressiveness-diversity");
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [selectedInteraction, setSelectedInteraction] = useState(null);

  const selectedAxis = axisOptions[axisMode];
  const transformedData = {
    datasets: [
      {
        label: "Color Traits",
        data: people.map((p) => selectedAxis.computeXY(p)),
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
    ],
  };

  const getDominantColor = (person) => {
    if (!person.color_matches) return "rgba(200, 200, 200, 0.5)"; // default color is gray

    const colors = {
      Yellow: "rgba(255, 206, 86, 0.5)",
      Blue: "rgba(54, 162, 235, 0.5)",
      Red: "rgba(255, 99, 132, 0.5)",
      Green: "rgba(75, 192, 192, 0.5)",
    };

    const dominant = Object.entries(person.color_matches).reduce((a, b) =>
      a[1] > b[1] ? a : b
    )[0];

    return colors[dominant];
  };

  const getPolarData = (person) => ({
    labels: ["Yellow", "Blue", "Red", "Green"],
    datasets: [
      {
        label: "Color Distribution",
        data: person
          ? [
              person.color_matches.Yellow || 0,
              person.color_matches.Blue || 0,
              person.color_matches.Red || 0,
              person.color_matches.Green || 0,
            ]
          : [0, 0, 0, 0],
        backgroundColor: [
          "rgba(255, 206, 86, 0.5)", // yellow
          "rgba(54, 162, 235, 0.5)", // blue
          "rgba(255, 99, 132, 0.5)", // red
          "rgba(75, 192, 192, 0.5)", // green
        ],
        borderWidth: 1,
      },
    ],
  });

  const transformedDataPersonSpecific = {
    datasets: [
      {
        label: "Color Traits",
        data: people.map((p) => selectedAxis.computeXY(p)),
        backgroundColor: people.map((p) => getDominantColor(p)),
      },
    ],
  };

  const handlePersonClick = (person) => {
    setSelectedPerson(person);
  };

  useEffect(() => {
    const styleSheet = document.createElement("style");
    styleSheet.innerText = tooltipStyles;
    document.head.appendChild(styleSheet);
    setIsClient(true);

    return () => {
      document.head.removeChild(styleSheet);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 font-inter">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <Link
            href="/"
            className="text-gray-800 hover:text-gray-600 transition-colors"
          >
            ← Back to Homepage
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 font-inter">
            Visualization Dashboard
          </h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-row items-center justify-center mb-10 w-full">
          <AnimatedTooltip items={people} onItemClick={handlePersonClick} />
        </div>

        {isClient && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">Polar Chart</h2>
              <div style={{ height: "400px" }}>
                <PolarArea
                  data={getPolarData(selectedPerson)}
                  options={{
                    ...chartOptions,
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                      r: {
                        max: 70,
                        beginAtZero: true,
                      },
                    },
                    animation: {
                      animateRotate: true,
                      animateScale: true,
                    },
                  }}
                />
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">Color Traits Map</h2>
              <div className="flex gap-2 mb-4">
                <button
                  className="px-4 py-2 text-sm font-medium rounded-md text-white transition-opacity opacity-80 hover:opacity-100"
                  style={{ backgroundColor: "#886176" }}
                  onClick={() => setAxisMode("expressiveness-diversity")}
                >
                  Expressiveness vs Reserved
                </button>
                <button
                  className="px-4 py-2 text-sm font-medium rounded-md text-white transition-opacity opacity-80 hover:opacity-100"
                  style={{ backgroundColor: "#7C5869" }}
                  onClick={() => setAxisMode("openness-authority")}
                >
                  Openness vs Authority
                </button>
                <button
                  className="px-4 py-2 text-sm font-medium rounded-md text-white transition-opacity opacity-80 hover:opacity-100"
                  style={{ backgroundColor: "#5A7D7C" }}
                  onClick={() => setAxisMode("positive-negative")}
                >
                  Pos vs Neg Traits
                </button>
              </div>
              <div style={{ height: "400px" }}>
                <Bubble
                  data={transformedDataPersonSpecific}
                  options={{
                    ...chartOptions,
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      ...chartOptions.plugins,
                      legend: {
                        display: false, // removed legend but can put back on if we find a good thing to displau
                      },
                    },
                    scales: {
                      x: {
                        beginAtZero: true,
                        max: 100,
                        title: {
                          display: true,
                          text: selectedAxis.xLabel,
                        },
                      },
                      y: {
                        beginAtZero: true,
                        max: 100,
                        title: {
                          display: true,
                          text: selectedAxis.yLabel,
                        },
                      },
                    },
                  }}
                />
              </div>
            </div>

            {selectedPerson && (
              <div className="col-span-2 bg-white p-6 rounded-lg shadow">
                <h2 className="text-xl font-semibold mb-4">
                  Interaction Timeline - {selectedPerson.name}
                </h2>
                <div style={{ height: "300px" }} className="relative">
                  <TimelineChart
                    person={selectedPerson}
                    onPointHover={(interaction) =>
                      setSelectedInteraction(interaction)
                    }
                  />
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      <FloatingBubbles />
    </div>
  );
}
