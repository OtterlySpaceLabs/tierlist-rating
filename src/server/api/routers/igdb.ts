import { AppTokenAuthProvider } from "@twurple/auth"
import { z } from "zod"

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc"
import { env } from "../../../env.mjs"
import apicalypse, { ApicalypseConfig } from "apicalypse"

const twitchAuthProvider = new AppTokenAuthProvider(env.TWITCH_CLIENT_ID, env.TWITCH_CLIENT_SECRET)

const ApicalypseConfig = (accessToken: string): ApicalypseConfig => ({
	baseURL: "https://api.igdb.com/v4",
	method: "POST",
	headers: {
		"Client-ID": env.TWITCH_CLIENT_ID,
		Authorization: `Bearer ${accessToken}`
	}
})

export interface Game {
	id: number
	name: string
	cover: {
		id: number
		url: string
		width: number
		height: number
	}
}

export const igdbRouter = createTRPCRouter({
	searchGames: protectedProcedure.input(z.string()).mutation(async ({ input }) => {
		const accessToken = await twitchAuthProvider.getAppAccessToken()

		const options = ApicalypseConfig(accessToken.accessToken)

		const resp = await apicalypse(options)
			.limit(10)
			.search(input)
			.fields("name,cover.url,cover.width,cover.height,checksum,status,category")
			.where("category = 0 & parent_game = null & version_parent = null & version_title = null")
			.request("/games")

		return resp.data as Game[]
	})
})
