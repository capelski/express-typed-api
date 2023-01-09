/**
 * Cucumber dataTable format. E.g: for the cucumber table
 *
 * | A1 | B1 |
 * | A2 | B2 |
 *
 * the corresponding dataTable object will be:
 *
 * {
 *   rawTable: [
 *     [ 'A1', 'B1' ],
 *     [ 'A2', 'B2' ]
 *   ]
 * }
 */
export interface ICucumberDataTable {
  rawTable: string[][];
}
