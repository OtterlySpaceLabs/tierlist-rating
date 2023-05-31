import { type Submission, type User } from "@prisma/client"

export type SubmissionWithAuthor = Submission & { author: User }
