import { type Submission, type User } from "@prisma/client"

export type SubmissionWithAuthor = Submission & { author: Pick<User, "id" | "name" | "image"> }
