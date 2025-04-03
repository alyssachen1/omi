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
import { PersonalityCard } from "@/components/ui/personality-card";
import { motion } from "framer-motion";


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

const people2 = [
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
    interactions: [
      {
        date: "2024-01-15",
        dominantColor: "Orange",
        wordCount: 220,
        color_matches: {
          Orange: 60,
          Green: 10,
        },
      },
      {
        date: "2024-01-18",
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
        date: "2024-01-20",
        dominantColor: "Red",
        wordCount: 120,
        color_matches: {
          Red: 70,
          Yellow: 20,
          Blue: 10,
        },
      },
      {
        date: "2024-01-22",
        dominantColor: "Red",
        wordCount: 120,
        color_matches: {
          Red: 75,
          Yellow: 20,
          Blue: 5,
        },
      },
    ],
    stats: {
      totalInteractions: 4,
      lastMessage: "2024-04-14",
      avgWordsPerSession: 120,
      colorShifts: 2,
      colorTimeline: "Orange → Yellow → Red",
    },
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
    interactions: [
      {
        date: "2024-01-15",
        dominantColor: "Blue",
        wordCount: 150,
        color_matches: {
          Yellow: 10,
          Blue: 60,
          Red: 20,
          Green: 10,
        }
      }
    ],
    stats: {
      totalInteractions: 1,
      lastMessage: "2024-01-15",
      avgWordsPerSession: 150,
      colorShifts: 0,
      colorTimeline: "Blue"
    }
  }
];

const styles = `
  .group:hover .group-hover\\:border-transparent {
    border-color: transparent;
  }

  [style*="--hover-bg"]:hover {
    background-color: var(--hover-bg) !important;
  }
`;

export default function AnimatedTooltipPreview() {
  const [question, setQuestion] = useState("");
  const [isClient, setIsClient] = useState(false);
  const [axisMode, setAxisMode] = useState("expressiveness-diversity");
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [selectedInteraction, setSelectedInteraction] = useState(null);
  const [memoryData, setMemoryData] = useState(null);
  const [people, setPeople] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("memoryData");
    if (stored) {
      const storedObj = JSON.parse(stored);
      setMemoryData(storedObj);
      try {
        const peopleObj = JSON.parse(storedObj.ai_analysis);
        // Add interactions data to any person missing it
        const updatedPeopleObj = peopleObj.map(person => {
          if (!person.interactions) {
            return {
              ...person,
              interactions: [
                {
                  date: new Date().toISOString().split('T')[0],
                  dominantColor: person.suggested_color,
                  wordCount: 150,
                  color_matches: person.color_matches
                }
              ],
              stats: {
                totalInteractions: 1,
                lastMessage: new Date().toISOString().split('T')[0],
                avgWordsPerSession: 150,
                colorShifts: 0,
                colorTimeline: person.suggested_color
              }
            };
          }
          return person;
        });
        console.log("Updated people data:", updatedPeopleObj);
        setPeople(updatedPeopleObj);
      } catch (error) {
        console.error("Error parsing AI analysis:", error);
        setPeople(people2); // Fallback to people2 if there's an error
      }
    } else {
      setPeople(people2); // Use people2 as fallback
    }
    setIsLoading(false);
  }, []);

  const axisOptions = {
    "expressiveness-diversity": {
      xLabel: "Expressiveness",
      yLabel: "Reserved",
      computeXY: (person) => ({
        x: person.color_matches.Yellow || 0,
        y: person.pos_traits.length + person.neg_traits.length,
        r: 15,
      }),
    },
    "proactive-reactive": {
      xLabel: "Proactive",
      yLabel: "Reactive",
      computeXY: (person) => ({
        x: (person.color_matches.Yellow || 0) + (person.color_matches.Green || 0) * 0.5,
        y: (person.color_matches.Red || 0) + (person.color_matches.Blue || 0) * 0.3,
        r: 15,
      }),
    },
    "positive-negative": {
      xLabel: "Positive Traits",
      yLabel: "Negative Traits",
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

  const bubbleOptions = {
    scales: {
      x: {
        title: {
          display: true,
          text: axisOptions[axisMode].xLabel,
          font: {
            size: 14
          }
        },
        grid: {
          display: true
        }
      },
      y: {
        title: {
          display: true,
          text: axisOptions[axisMode].yLabel,
          font: {
            size: 14
          }
        },
        grid: {
          display: true
        }
      }
    },
    plugins: {
      legend: {
        display: false
      }
    }
  };

  const selectedAxis = axisOptions[axisMode];

  const getDominantColorRGB = (person) => {
    if (!person.color_matches) return "rgba(200, 200, 200, 0.3)"; // default color with opacity

    const colors = {
      Yellow: "rgba(255, 206, 86, 0.3)",  // reduced opacity to 0.3
      Blue: "rgba(54, 162, 235, 0.3)",
      Red: "rgba(255, 99, 132, 0.3)",
      Green: "rgba(75, 192, 192, 0.3)",
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
        data: people ? people.map((p) => selectedAxis.computeXY(p)) : [],
        backgroundColor: people ? people.map((p) => getDominantColorRGB(p)) : [],
      },
    ],
  };

  const handlePersonClick = (person) => {
    setSelectedPerson(person);
  };

  const handleAxisChange = (axis) => {
    setAxisMode(axis);
  };

  useEffect(() => {
    const styleSheet = document.createElement("style");
    styleSheet.innerText = tooltipStyles + styles;
    document.head.appendChild(styleSheet);
    setIsClient(true);

    return () => {
      document.head.removeChild(styleSheet);
    };
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 font-inter flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  if (!people) {
    return (
      <div className="min-h-screen bg-gray-50 font-inter flex items-center justify-center">
        <div className="text-xl text-gray-600">No data available</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-inter">
      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex justify-center items-center mb-8">
          <AnimatedTooltip items={people} onItemClick={handlePersonClick}>
            {(item) => (
              <div
                className="w-24 h-24 flex items-center justify-center rounded-full 
                  border border-black/20 bg-white text-black transition-all duration-300
                  hover:text-white"
                style={{
                  backgroundColor: 'white',
                  ':hover': {
                    backgroundColor: getDominantColorRGB(item),
                  }
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = getDominantColorRGB(item);
                  e.currentTarget.style.borderColor = getDominantColorRGB(item);
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'white';
                  e.currentTarget.style.borderColor = 'rgba(0, 0, 0, 0.2)';
                }}
              >
                <span className="text-sm font-medium">
                  {item.name.charAt(0).toUpperCase() + item.name.slice(1)}
                </span>
              </div>
            )}
          </AnimatedTooltip>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {selectedPerson && (
            <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.2 }}>
              <PersonalityCard person={selectedPerson} />
            </motion.div>
          )}

          {selectedPerson && (
            <div className="bg-white p-6 rounded-lg shadow h-[500px] flex flex-col card transition-transform duration-200 hover:scale-105">
              <h2 className="text-xl font-semibold mb-4 text-center">Color Traits Map</h2>
              <div className="flex gap-2 mb-4 justify-center">
                <button
                  className={`px-4 py-2 text-xs font-small rounded-md ${axisMode === "expressiveness-diversity" ? 'bg-black text-white' : 'bg-white text-black border border-black'} transition-colors`}
                  onClick={() => handleAxisChange("expressiveness-diversity")}
                >
                  Expressiveness vs Reserved
                </button>
                <button
                  className={`px-4 py-2 text-xs font-small rounded-md ${axisMode === "proactive-reactive" ? 'bg-black text-white' : 'bg-white text-black border border-black'} transition-colors`}
                  onClick={() => handleAxisChange("proactive-reactive")}
                >
                  Proactive vs Reactive
                </button>
                <button
                  className={`px-4 py-2 text-xs font-small rounded-md ${axisMode === "positive-negative" ? 'bg-black text-white' : 'bg-white text-black border border-black'} transition-colors`}
                  onClick={() => handleAxisChange("positive-negative")}
                >
                  Pos vs Neg Traits
                </button>
              </div>
              <div className="flex-1 flex items-center justify-center">
                <Bubble
                  data={transformedDataPersonSpecific}
                  options={{
                    ...bubbleOptions,
                    plugins: {
                      legend: {
                        display: false,
                      },
                      tooltip: {
                        callbacks: {
                          label: (context) => {
                            const personIndex = context.dataIndex;
                            const person = people[personIndex];
                            return person.name.charAt(0).toUpperCase() + person.name.slice(1);
                          },
                        },
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        padding: 12,
                        titleFont: {
                          size: 14
                        },
                        bodyFont: {
                          size: 14
                        },
                        displayColors: false,
                      },
                    },
                  }}
                />
              </div>
            </div>
          )}
        </div>


        {/* Personality Card and Polar Chart */}
        {selectedPerson && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-lg shadow h-auto flex flex-col transition-transform duration-200 hover:scale-105">
              <h2 className="text-xl font-semibold mb-4 text-center">Interaction Timeline</h2>
              <div className="flex-1 flex items-center justify-center">
                {selectedPerson && <TimelineChart person={selectedPerson} />}
              </div>
            </div>


            <div className="bg-white p-6 rounded-lg shadow h-[500px] transition-transform duration-200 hover:scale-105">
              <h2 className="text-xl font-semibold mb-4">Color Distribution</h2>
              <div className="h-[calc(100%-2rem)] flex items-center justify-center">
                <PolarArea
                  data={getPolarData(selectedPerson)}
                  options={{
                    ...chartOptions,
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                      r: {
                        max: 100,
                        beginAtZero: true,
                      },
                    },
                    animation: {
                      animateRotate: true,
                      animateScale: true,
                    },
                    plugins: {
                      tooltip: {
                        enabled: false,
                      },
                      legend: {
                        display: true,
                      },
                    },
                  }}
                />
              </div>
            </div>
          </div>
        )}
      </main>

      <FloatingBubbles />
    </div>
  );
}

