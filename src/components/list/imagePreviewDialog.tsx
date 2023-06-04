import { SmashType, type SmashEntry, SmashVote, type Submission } from "@prisma/client"
import { Fragment, useCallback } from "react"
import { Dialog, Transition } from "@headlessui/react"
import Image from "next/image"
import { XMarkIcon } from "@heroicons/react/24/outline"
import { type SubmissionWithAuthor } from "../../server/api/routers/submission/submission.interface"

interface ImagePreviewDialogProps {
	submission: SubmissionWithAuthor | Submission
	smash?: SmashEntry
	open: boolean
	onClose: () => void
}

export default function ImagePreviewDialog({ submission, smash, open, onClose }: ImagePreviewDialogProps) {
	const smashTypeToString = useCallback((smashType: SmashType) => {
		switch (smashType) {
			case SmashType.TOP:
				return "Top"
			case SmashType.VERSE:
				return "Versatile"
			case SmashType.BOTTOM:
				return "Bottom"
		}
	}, [])

	const smashVoteToString = useCallback((smashVote: SmashVote) => {
		switch (smashVote) {
			case SmashVote.SMASH:
				return "Smash"
			case SmashVote.PASS:
				return "Pass"
		}
	}, [])

	return (
		<Transition.Root show={open} as={Fragment}>
			<Dialog as="div" className="relative z-10" onClose={onClose}>
				<Transition.Child
					as={Fragment}
					enter="ease-out duration-300"
					enterFrom="opacity-0"
					enterTo="opacity-100"
					leave="ease-in duration-200"
					leaveFrom="opacity-100"
					leaveTo="opacity-0"
				>
					<div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity dark:bg-gray-700/75" />
				</Transition.Child>

				<div className="fixed inset-0 z-10 overflow-y-auto">
					<div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
						<Transition.Child
							as={Fragment}
							enter="ease-out duration-300"
							enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
							enterTo="opacity-100 translate-y-0 sm:scale-100"
							leave="ease-in duration-200"
							leaveFrom="opacity-100 translate-y-0 sm:scale-100"
							leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
						>
							<Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-sky-50 px-4 pb-4 pt-5 text-left shadow-xl transition-all dark:bg-slate-950 sm:my-8 sm:w-full sm:max-w-3xl sm:p-6">
								<div className="absolute right-0 top-0 pr-4 pt-4">
									<button
										type="button"
										className="rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
										onClick={() => onClose()}
									>
										<span className="sr-only">Close</span>
										<XMarkIcon className="h-6 w-6" aria-hidden="true" />
									</button>
								</div>
								<div className="sm:flex sm:items-start">
									<div className="mt-3 flex w-full flex-col text-center sm:ml-4 sm:mt-0 sm:text-left">
										<Dialog.Title
											as="h3"
											className="text-base font-semibold leading-6 text-gray-900 dark:text-white"
										>
											Image
										</Dialog.Title>

										<div className="mt-2">
											<div className="relative h-[75vh]">
												<Image
													unoptimized
													src={submission.image}
													alt={submission.name}
													fill
													className="object-contain"
												/>
											</div>
										</div>

										<div className="mt-2 grid grid-cols-2">
											<div>
												<p className="pt-2 text-sm font-bold text-gray-500 dark:text-gray-400">
													{submission.name} - {submission.game}
												</p>
												{"author" in submission && submission.author?.name && (
													<p className="pt-2 text-sm text-gray-500 dark:text-gray-400">
														Submitted by{" "}
														<span className="font-bold">{submission.author.name}</span>
													</p>
												)}
											</div>
											<div>
												{smash && (
													<>
														<p className="pt-2 text-sm text-gray-500 dark:text-gray-400">
															You voted{" "}
															<span className="font-bold">
																{smashVoteToString(smash.vote)}
															</span>
														</p>
														{smash.type && (
															<p className="pt-2 text-sm text-gray-500 dark:text-gray-400">
																You think they are{" "}
																<span className="font-bold">
																	{smashTypeToString(smash.type)}
																</span>
															</p>
														)}
													</>
												)}
											</div>
										</div>
									</div>
								</div>
							</Dialog.Panel>
						</Transition.Child>
					</div>
				</div>
			</Dialog>
		</Transition.Root>
	)
}
