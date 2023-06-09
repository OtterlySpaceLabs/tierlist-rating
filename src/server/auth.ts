import { type GetServerSidePropsContext } from "next"
import { getServerSession, type NextAuthOptions, type DefaultSession } from "next-auth"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import TwitchProvider, { type TwitchProfile } from "next-auth/providers/twitch"
import { env } from "~/env.mjs"
import { prisma } from "~/server/db"

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
	interface Session extends DefaultSession {
		user: {
			id: string
			isModerator: boolean
			isStreamer: boolean
			// ...other properties
			// role: UserRole;
		} & DefaultSession["user"]
	}

	// interface User {
	//   // ...other properties
	//   // role: UserRole;
	// }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authOptions: NextAuthOptions = {
	callbacks: {
		session: ({ session, token }) => ({
			...session,
			user: {
				...session.user,
				id: token.sub,
				isModerator: env.ALLOWED_MODERATORS.includes(session.user.name ? session.user.name.toLowerCase() : ""),
				isStreamer: env.ALLOWED_STREAMERS.includes(session.user.name ? session.user.name.toLowerCase() : "")
			}
		})
	},
	adapter: PrismaAdapter(prisma),
	providers: [
		TwitchProvider<TwitchProfile>({
			clientId: env.TWITCH_CLIENT_ID,
			clientSecret: env.TWITCH_CLIENT_SECRET,
			authorization: {
				params: {
					scope: "openid user:read:email"
				}
			}
		})
		/**
		 * ...add more providers here.
		 *
		 * Most other providers require a bit more work than the Discord provider. For example, the
		 * GitHub provider requires you to add the `refresh_token_expires_in` field to the Account
		 * model. Refer to the NextAuth.js docs for the provider you want to use. Example:
		 *
		 * @see https://next-auth.js.org/providers/github
		 */
	],
	session: {
		strategy: "jwt"
	}
}

/**
 * Wrapper for `getServerSession` so that you don't need to import the `authOptions` in every file.
 *
 * @see https://next-auth.js.org/configuration/nextjs
 */
export const getServerAuthSession = (ctx: {
	req: GetServerSidePropsContext["req"]
	res: GetServerSidePropsContext["res"]
}) => {
	return getServerSession(ctx.req, ctx.res, authOptions)
}
