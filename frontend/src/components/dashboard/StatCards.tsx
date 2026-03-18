"use client";

import { FileText, Calendar, Trophy, XCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface StatCardsProps {
  stats: {
    total: number;
    interview_scheduled: number;
    interviewed: number;
    offers: number;
    rejected: number;
  };
}

const statConfig = [
  {
    key: "total" as const,
    label: "Total Applications",
    icon: FileText,
    gradient: "from-blue-500 to-blue-600",
    bgColor: "bg-blue-50",
    textColor: "text-blue-600",
  },
  {
    key: "interview_scheduled" as const,
    label: "Interview Scheduled",
    icon: Calendar,
    gradient: "from-amber-500 to-orange-500",
    bgColor: "bg-amber-50",
    textColor: "text-amber-600",
  },
  {
    key: "interviewed" as const,
    label: "Interviewed",
    icon: Calendar,
    gradient: "from-purple-500 to-purple-600",
    bgColor: "bg-purple-50",
    textColor: "text-purple-600",
  },
  {
    key: "offers" as const,
    label: "Offers",
    icon: Trophy,
    gradient: "from-emerald-500 to-green-600",
    bgColor: "bg-emerald-50",
    textColor: "text-emerald-600",
  },
  {
    key: "rejected" as const,
    label: "Rejected",
    icon: XCircle,
    gradient: "from-rose-500 to-red-600",
    bgColor: "bg-rose-50",
    textColor: "text-rose-600",
  },
];

function StatCards({ stats }: StatCardsProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {statConfig.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card
            key={stat.key}
            className="group relative overflow-hidden border-0 shadow-sm transition-all hover:shadow-md"
          >
            <div
              className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-0 transition-opacity group-hover:opacity-5`}
            />
            <CardContent className="flex items-center gap-4 p-6">
              <div
                className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${stat.bgColor}`}
              >
                <Icon className={`h-6 w-6 ${stat.textColor}`} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-muted-foreground">
                  {stat.label}
                </p>
                <p className={`text-2xl font-bold ${stat.textColor}`}>
                  {stats[stat.key]}
                </p>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

export default StatCards;
