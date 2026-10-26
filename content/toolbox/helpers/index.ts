import { AppRoot, Helpers } from 'nubond';

@AppRoot()
export class App {
    public checks: Array<[string, unknown]> = [
        ['equals({ a: [1, 2] }, { a: [1, 2] })', Helpers.equals({ a: [1, 2] }, { a: [1, 2] })],
        ['equals(new Date(0), new Date(0))', Helpers.equals(new Date(0), new Date(0))],
        ["fromKebabToCamelCase('meta-data')", Helpers.fromKebabToCamelCase('meta-data')],
        ["fromCamelToKebabCase('metaData')", Helpers.fromCamelToKebabCase('metaData')],
        ["format('{0} of {1}', 3, 10)", Helpers.format('{0} of {1}', 3, 10)],
        ['stringify({ id: 1 })', Helpers.stringify({ id: 1 })],
        ["isNotEmptyString(' ')", Helpers.isNotEmptyString(' ')]
    ];
}
