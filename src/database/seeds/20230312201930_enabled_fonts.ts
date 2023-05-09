import { Knex } from 'knex';
import enabledFonts from '../data/enabled_fonts.json';

const table = 'enabled_fonts';

export async function seed(knex: Knex): Promise<void> {
  await knex(table).del();
  try {
    return await knex.transaction(async (trx) => {
      // await trx(table).insert(fonts);
      await knex.batchInsert(table, enabledFonts, 400).transacting(trx);
    });
  } catch (err) {
    console.error(err);
  }
  // return knex(table).insert(enabledFonts);
}
