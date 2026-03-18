"use client"

import {
  MapPin,
  DollarSign,
  ExternalLink,
  Trash2,
  ChevronDown,
  ChevronUp,
  FileText,
} from "lucide-react"
import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { Job, JobStatus } from "@/lib/types"

interface JobCardProps {
  job: Job
  onStatusChange: (id: string, status: JobStatus) => void
  onDelete: (id: string) => void
}

const statusConfig: Record<
  JobStatus,
  { label: string; className: string }
> = {
  saved: {
    label: "Saved",
    className: "bg-slate-100 text-slate-700 hover:bg-slate-200",
  },
  applied: {
    label: "Applied",
    className: "bg-blue-100 text-blue-700 hover:bg-blue-200",
  },
  interview_scheduled: {
    label: "Interview",
    className: "bg-amber-100 text-amber-700 hover:bg-amber-200",
  },
  interviewed: {
    label: "Interviewed",
    className: "bg-purple-100 text-purple-700 hover:bg-purple-200",
  },
  offer: {
    label: "Offer",
    className: "bg-emerald-100 text-emerald-700 hover:bg-emerald-200",
  },
  rejected: {
    label: "Rejected",
    className: "bg-rose-100 text-rose-700 hover:bg-rose-200",
  },
  withdrawn: {
    label: "Withdrawn",
    className: "bg-gray-100 text-gray-700 hover:bg-gray-200",
  },
}

export function JobCard({ job, onStatusChange, onDelete }: JobCardProps) {
  const [showNotes, setShowNotes] = useState(false)

  const initials = job.company
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()

  return (
    <Card className="group overflow-hidden border shadow-sm transition-all hover:shadow-md">
      <CardContent className="p-0">
        <div className="flex flex-col gap-4 p-5">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 text-sm font-semibold text-white">
                {initials}
              </div>
              <div className="min-w-0">
                <h3 className="font-semibold text-foreground">{job.title}</h3>
                <p className="text-sm text-muted-foreground">{job.company}</p>
              </div>
            </div>
            <Select
              value={job.status}
              onValueChange={(value: JobStatus) =>
                onStatusChange(job.id, value)
              }
            >
              <SelectTrigger className="w-[130px] border-0 bg-transparent p-0 shadow-none focus:ring-0">
                <Badge
                  className={`cursor-pointer border-0 ${statusConfig[job.status].className}`}
                >
                  {statusConfig[job.status].label}
                </Badge>
              </SelectTrigger>
              <SelectContent>
                {Object.entries(statusConfig).map(([key, config]) => (
                  <SelectItem key={key} value={key}>
                    <Badge className={`border-0 ${config.className}`}>
                      {config.label}
                    </Badge>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
            {job.location && (
              <span className="flex items-center gap-1.5">
                <MapPin className="h-4 w-4" />
                {job.location}
              </span>
            )}
            {job.salary && (
              <span className="flex items-center gap-1.5">
                <DollarSign className="h-4 w-4" />
                {job.salary}
              </span>
            )}
          </div>

          {job.notes && (
            <button
              onClick={() => setShowNotes(!showNotes)}
              className="flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              <FileText className="h-4 w-4" />
              {showNotes ? "Hide notes" : "Show notes"}
              {showNotes ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </button>
          )}

          {showNotes && job.notes && (
            <div className="rounded-lg bg-muted/50 p-3 text-sm text-muted-foreground">
              {job.notes}
            </div>
          )}

          <div className="flex items-center justify-between border-t pt-4">
            {job.url ? (
              <a
                href={job.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-sm font-medium text-primary transition-colors hover:text-primary/80"
              >
                View Job Posting
                <ExternalLink className="h-4 w-4" />
              </a>
            ) : (
              <span />
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(job.id)}
              className="text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
