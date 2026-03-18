export type JobStatus = 'saved' | 'applied' | 'interview_scheduled' | 'interviewed' | 'offer' | 'rejected' | 'withdrawn'

export interface Job {
  id: string
  company: string
  title: string
  location?: string
  salary?: string
  url?: string
  status: JobStatus
  notes?: string
  createdAt: string
}