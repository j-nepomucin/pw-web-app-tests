// Defines different types of tests for categorization purposes.
export enum TestType {
    Sanity = 'sanity',
    Smoke = 'smoke',
    Regression = 'regression'
}

export class TestTypeDefinition {
    static is_valid_test_type(type: string): boolean {
        return Object.values(TestType).includes(type as TestType);
    }

    static get_test_types(): TestType[] {
        return Object.values(TestType);
    }
}