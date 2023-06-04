import { Fragment, useCallback, useState } from "react"
import { Dialog, Transition } from "@headlessui/react"
import { ExclamationTriangleIcon, XMarkIcon } from "@heroicons/react/24/outline"
import { type Submission } from "@prisma/client"
import { api } from "../../utils/api"

interface DeleteDialogProps {
	submission?: Submission | null
	open: boolean
	onClose: (deleted?: boolean) => void
}

export default function DeleteDialog({ submission, onClose, open }: DeleteDialogProps) {
	const deleteSubmissionMutation = api.submission.delete.useMutation()
	const [deleteInProgress, setDeleteInProgress] = useState(false)

	const deleteSubmission = useCallback(async () => {
		if (!submission) {
			return
		}
		setDeleteInProgress(true)
		await deleteSubmissionMutation.mutateAsync({
			id: submission.id
		})
		setDeleteInProgress(false)
		onClose(true)
	}, [submission, onClose, deleteSubmissionMutation])

	const handleClose = useCallback(() => {
		if (deleteInProgress) {
			return
		}
		onClose()
	}, [deleteInProgress, onClose])

	if (!submission) {
		return null
	}

	return (
		<Transition.Root show={open} as={Fragment}>
			<Dialog as="div" className="relative z-10" onClose={handleClose}>
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
							<Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-sky-50 px-4 pb-4 pt-5 text-left shadow-xl transition-all dark:bg-slate-950 sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
								<div className="absolute right-0 top-0 hidden pr-4 pt-4 sm:block">
									<button
										type="button"
										className="rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
										onClick={() => handleClose()}
										disabled={deleteInProgress}
									>
										<span className="sr-only">Close</span>
										<XMarkIcon className="h-6 w-6" aria-hidden="true" />
									</button>
								</div>
								<div className="sm:flex sm:items-start">
									<div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
										<ExclamationTriangleIcon className="h-6 w-6 text-red-600" aria-hidden="true" />
									</div>
									<div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
										<Dialog.Title
											as="h3"
											className="text-base font-semibold leading-6 text-gray-900 dark:text-white"
										>
											Delete Entry
										</Dialog.Title>
										<div className="mt-2">
											<p className="text-sm text-gray-500 dark:text-gray-400">
												Are you sure you want to delete this entry? This cannot be undone.
											</p>
											<p className="pt-2 text-sm font-bold text-gray-500 dark:text-gray-400">
												{submission.name} - {submission.game}
											</p>
										</div>
									</div>
								</div>
								<div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
									<button
										type="button"
										className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-50 sm:ml-3 sm:w-auto"
										disabled={deleteInProgress}
										onClick={() => void deleteSubmission()}
									>
										Delete
									</button>
									<button
										type="button"
										className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 sm:mt-0 sm:w-auto"
										disabled={deleteInProgress}
										onClick={() => handleClose()}
									>
										Cancel
									</button>
								</div>
							</Dialog.Panel>
						</Transition.Child>
					</div>
				</div>
			</Dialog>
		</Transition.Root>
	)
}
