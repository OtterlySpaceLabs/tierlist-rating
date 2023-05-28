import { type Submission, type User } from "@prisma/client"
import { Fragment } from "react"
import { Dialog, Transition } from "@headlessui/react"
import Image from "next/image"
import { XMarkIcon } from "@heroicons/react/24/outline"

interface ImagePreviewDialogProps {
	submission: Submission & { author?: User }
	open: boolean
	onClose: () => void
}

export default function ImagePreviewDialog({ submission, open, onClose }: ImagePreviewDialogProps) {
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
									<div className="mt-3 flex flex-col text-center sm:ml-4 sm:mt-0 sm:text-left">
										<Dialog.Title
											as="h3"
											className="text-base font-semibold leading-6 text-gray-900 dark:text-white"
										>
											Image
										</Dialog.Title>

										<div className="max-h[90vh] max-w[90vw] relative mt-2 h-full w-full">
											<Image
												unoptimized
												src={submission.image}
												alt={submission.name}
												width={1000}
												height={1000}
											/>
										</div>

										<div className="mt-2">
											<p className="pt-2 text-sm font-bold text-gray-500 dark:text-gray-400">
												{submission.name} - {submission.game}
											</p>
											{submission.author?.name && (
												<p className="pt-2 text-sm text-gray-500 dark:text-gray-400">
													Submitted by{" "}
													<span className="font-bold">{submission.author.name}</span>
												</p>
											)}
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
