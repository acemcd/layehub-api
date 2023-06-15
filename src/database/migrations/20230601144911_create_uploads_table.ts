import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('uploads', (table) => {
    table.increments('id').primary();
    table.string('filename').notNullable();
    table.string('originalname').notNullable();
    table.string('description').nullable();
    table.string('src').notNullable();
    table.string('thumbnailSrc').notNullable();
    table.string('type').notNullable();
    table.integer('size').nullable();
    table.string('tags').nullable();
    table.dateTime('createdAt').notNullable().defaultTo(knex.fn.now());
    table.dateTime('updatedAt').nullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('uploads');
}
