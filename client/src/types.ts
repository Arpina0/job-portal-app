export enum JobType {
  FULL_TIME = 'FULL_TIME',
  PART_TIME = 'PART_TIME',
  CONTRACT = 'CONTRACT',
  INTERNSHIP = 'INTERNSHIP'
}

export enum JobStatus {
  OPEN = 'OPEN',
  CLOSED = 'CLOSED',
  DRAFT = 'DRAFT'
}

export interface Job {
  id: number;
  title: string;
  company: string;
  location: string;
  description: string;
  requirements: string;
  minSalary?: number;
  maxSalary?: number;
  type: JobType;
  status: JobStatus;
  postedDate: string;
  recruiter_id: number;
} 