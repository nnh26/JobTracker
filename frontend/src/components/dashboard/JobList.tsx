"use client"

import { Briefcase, Search } from "lucide-react"
import { JobCard } from "./JobCard"
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle, EmptyDescription } from "@/components/ui/empty"
import type { Job, JobStatus } from "@/lib/types"

interface JobsListProps {
  jobs: Job[]
  onStatusChange: (id: string, status: JobStatus) => void
  onDelete: (id: string) => void
}

export default function JobList({ jobs, onStatusChange, onDelete }: JobsListProps) {
  if (jobs.length === 0) {
    return (
      <Empty className="border bg-card py-16">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <Briefcase className="h-6 w-6" />
          </EmptyMedia>
          <EmptyTitle>No applications yet</EmptyTitle>
          <EmptyDescription>
            Start tracking your job search by adding your first application.
            Click the "Add Application" button above to get started.
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    )
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {jobs.map((job) => (
        <JobCard
          key={job.id}
          job={job}
          onStatusChange={onStatusChange}
          onDelete={onDelete}
        />
      ))}
    </div>
  )
}
