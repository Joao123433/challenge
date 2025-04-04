import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import z from "zod";
import { db } from "../../../db";
import { users } from "../../../db/schema";
import { eq } from "drizzle-orm";
import { compare } from "bcrypt";

export const LoginRouter: FastifyPluginAsyncZod = async (app) => {
	app.post(
		"/login",
		{
			schema: {
				body: z.object({
					email: z.string().email(),
					password: z.string(),
				}),
			},
		},
		async (req, res) => {
			const { email, password } = req.body;

			const [user] = await db
				.select({
					id: users.id,
					email: users.email,
					password: users.password,
					name: users.name,
				})
				.from(users)
				.where(eq(users.email, email))
				.limit(1);

			const verifyPassword =
				user !== undefined ? await compare(password, user.password) : false;

			if (!user || !verifyPassword) {
				res.status(401).send({ message: "invalid credentials" });
			}

			const token = app.jwt.sign(
				{
					id: user.id,
					email: user.email,
					name: user.name,
				},
				{ expiresIn: "1h", algorithm: "HS256" },
			);

			console.log(token);

			res.setCookie("token", token, {
				httpOnly: true,
				secure: true,
				sameSite: "none",
				path: "/",
				maxAge: 60 * 60,
			});

			res.status(200).send({ message: "Login successfully" });
		},
	);
};
