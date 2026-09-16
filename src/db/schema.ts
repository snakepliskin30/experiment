import { pgTable, text, timestamp, varchar, uuid } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { z } from "zod";

export const tasks = pgTable("tasks", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: varchar("user_id", { length: 36 }),
  projectId: uuid("project_id").references(() => projects.id, {
    onDelete: "cascade",
  }),
  name: text("name").notNull(),
  description: text("description"),
  dueDate: timestamp("due_date").defaultNow().notNull(),
  completedOn: timestamp("completed_on"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

export const projects = pgTable("projects", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: varchar("user_id", { length: 36 }),
  name: text("name").notNull(),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

export const projectRelations = relations(projects, ({ many }) => ({
  tasks: many(tasks),
}));

export const taksRelations = relations(tasks, ({ one }) => ({
  project: one(projects, {
    fields: [tasks.projectId],
    references: [projects.id],
  }),
}));

export type TaskQuery = typeof tasks.$inferSelect;
export type TaskInsert = typeof tasks.$inferInsert;
export type ProjectQuery = typeof projects.$inferSelect;
export type ProjectInsert = typeof projects.$inferInsert;

// zod schemas
export const TaskInsertSchema: z.ZodType<TaskInsert> = z.object({
  name: z.string().min(1),
  description: z.string(),
  dueDate: z.coerce.date(),
  projectId: z.uuid().min(1),
});

export const ProjectInsertSchema: z.ZodType<ProjectInsert> = z.object({
  name: z.string().min(1),
  description: z.string(),
});
