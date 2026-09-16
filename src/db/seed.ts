// import { faker } from "@faker-js/faker";
import { db } from "../db";
import { tasks, projects } from "../db/schema";
import { sql } from "drizzle-orm";

function capitalize(word: string) {
  return word.charAt(0).toUpperCase() + word.slice(1);
}

const userIds = [
  "216c1653-7b13-49bd-9499-53007ead0126",
  "0cdbed84-0b12-4b89-91ae-5572e8e1258e",
  "4dd4510b-2b01-438d-be7a-0064460230a1",
  "google-oauth2|112192568774619697839",
];

async function main() {
  const { faker } = await import("@faker-js/faker");
  await db.execute(
    sql.raw(`TRUNCATE TABLE projects RESTART IDENTITY CASCADE;`),
  );
  await db.execute(sql.raw(`TRUNCATE TABLE tasks RESTART IDENTITY CASCADE;`));

  for (const userId of userIds) {
    const createdProject = await db
      .insert(projects)
      .values({
        userId: userId,
        name: capitalize(faker.word.noun()),
        description: faker.lorem.sentence(),
      })
      .returning();

    for (let i = 1; i <= 2; i++) {
      await db.insert(tasks).values({
        userId: userId,
        projectId: i % 2 === 0 ? createdProject[0].id : null,
        name: `${capitalize(faker.word.verb())} ${faker.word.noun()}`,
        description: faker.lorem.sentence(),
        dueDate: faker.date.future(),
      });
    }
  }
}

main()
  .then(async () => {
    console.log("successful seed");
  })
  .catch(async (e) => {
    console.error(e);
    process.exit(1);
  });
