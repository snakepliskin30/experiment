import {
  pgTable,
  text,
  timestamp,
  varchar,
  index,
  uuid,
} from "drizzle-orm/pg-core";
import { defineRelations } from "drizzle-orm";

export const tasks = pgTable(
  "tasks",
  {
    id: uuid("id").primaryKey(),
    userId: varchar("user_id", { length: 36 }),
    projectId: text("project_id"),
    name: text("name").notNull(),
    description: text("description"),
    dueDate: timestamp("due_date").defaultNow().notNull(),
    completedOn: timestamp("completed_on"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [index("userId_idx").on(table.userId)],
);

export const projects = pgTable(
  "projects",
  {
    id: uuid("id").primaryKey(),
    userId: varchar("user_id", { length: 36 }),
    name: text("name").notNull(),
    description: text("description"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [index("userId_idx").on(table.userId)],
);

export const relations = defineRelations({ tasks, projects }, (r) => ({
  projects: {
    tasks: r.many.tasks({
      from: r.projects.id,
      to: r.tasks.projectId,
    }),
  },
  tasks: {
    projects: r.one.projects({
      from: r.tasks.projectId,
      to: r.projects.id,
    }),
  },
}));
