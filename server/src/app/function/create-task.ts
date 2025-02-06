import { desc, eq } from "drizzle-orm";
import { db } from "../../db";
import { task } from "../../db/schema";

async function generateNextRow(idStatus: string): Promise<number> {
	const lastTask = await db
		.select()
		.from(task)
		.where(eq(task.status, idStatus))
		.orderBy(desc(task.row));

	if (!lastTask || lastTask.length === 0) {
		return 1;
	}

	const lastNumber = lastTask[0].row;
	const nextNumber = lastNumber + 1;

	return nextNumber;
}

interface CreateTaskRequest {
	title: string;
	priority: string;
	deadline: string;
	status: string;
	comment: string;
	createdAt: number;
	updatedAt: number;
}

export async function createTask({
	title,
	priority,
	deadline,
	status,
	comment,
	createdAt,
	updatedAt,
}: CreateTaskRequest) {
	const row = await generateNextRow(status);

	const [taskInsert] = await db
		.insert(task)
		.values({
			title,
			priority,
			deadline: new Date(deadline),
			status,
			comment,
			row,
			createdAt: new Date(createdAt),
			updatedAt: new Date(updatedAt),
		})
		.returning();

	return { taskInsert };
}
