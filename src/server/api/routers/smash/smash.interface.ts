import { type SmashEntry, type Submission, type User } from "@prisma/client"

export type SmashWithSubmissionAndAuthor = SmashEntry & {
	submission: Submission & {
		author: User
	}
}
