import { Menu, Transition } from "@headlessui/react"
import { signIn, signOut, useSession } from "next-auth/react"
import { Fragment } from "react"
import { cn } from "../lib/utils"
import Image from "next/image"

export default function HeaderProfile() {
	const { data: sessionData } = useSession()

	return (
		<>
			{sessionData?.user ? (
				<Menu as="div" className="relative ml-4">
					<div className="group block flex-shrink-0 cursor-pointer">
						<Menu.Button className="flex">
							<div className="flex items-center">
								<span className="sr-only">Open user menu</span>
								<div className="flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
									<Image
										unoptimized
										className="inline-block h-8 w-8 rounded-full"
										src={sessionData.user.image || "/logo.png"}
										width={32}
										height={32}
										alt=""
									/>
								</div>
								<div className="ml-3">
									<p className="text-sm font-medium text-gray-700 group-hover:text-gray-900 dark:text-white dark:group-hover:text-gray-200">
										{sessionData.user.name}
									</p>
								</div>
							</div>
						</Menu.Button>
					</div>
					<Transition
						as={Fragment}
						enter="transition ease-out duration-100"
						enterFrom="transform opacity-0 scale-95"
						enterTo="transform opacity-100 scale-100"
						leave="transition ease-in duration-75"
						leaveFrom="transform opacity-100 scale-100"
						leaveTo="transform opacity-0 scale-95"
					>
						<Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
							<Menu.Item>
								{({ active }) => (
									<a
										onClick={() => {
											void signOut({
												callbackUrl: "/"
											})
										}}
										className={cn(
											active ? "bg-gray-100" : "",
											"block cursor-pointer px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
										)}
									>
										Logout
									</a>
								)}
							</Menu.Item>
						</Menu.Items>
					</Transition>
				</Menu>
			) : (
				<button
					className="ml-4 rounded bg-orange-500 px-4 py-2 text-sm font-bold text-white hover:bg-orange-600"
					onClick={() => {
						void signIn("twitch")
					}}
				>
					Sign in
				</button>
			)}
		</>
	)
}
