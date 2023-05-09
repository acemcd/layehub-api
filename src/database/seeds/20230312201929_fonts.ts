import { Knex } from 'knex';
import fonts from '../data/fonts.json';

const table = 'fonts';

export async function seed(knex: Knex): Promise<void> {
  await knex(table).del();
  try {
    await knex.transaction(async (trx) => {
      // await trx(table).insert(fonts);
      await knex.batchInsert(table, fonts, 400).transacting(trx);
    });
  } catch (err) {
    console.error(err);
  }
  // return knex(table).insert(fonts);
}
