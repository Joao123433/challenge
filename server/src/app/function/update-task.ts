import { eq } from "drizzle-orm";
import { task } from "../../db/schema";
import { db } from "../../db";

interface CreateTaskRequest {
	id: string;
	title: string;
	priority: string;
	deadline: string;
	status: string;
	comment: string;
	updatedAt: number;
}

export async function updateTask({
	id,
	title,
	priority,
	deadline,
	status,
	comment,
	updatedAt,
}: CreateTaskRequest) {
	const updateTaskFetch = db
		.update(task)
		.set({
			title,
			priority,
			deadline: new Date(deadline),
			status,
			comment,
			updatedAt: new Date(updatedAt),
		})
		.where(eq(task.id, id))
		.returning();

	return {
		updateTaskFetch,
	};
}
