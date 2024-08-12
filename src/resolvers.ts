interface Record {
    id: string;
    name: string;
    position: string;
    level: string;
}

const mockData: Record[] = [
    { id: '1', name: 'Alice', position: 'Developer', level: 'Junior' },
    { id: '2', name: 'Bob', position: 'Designer', level: 'Mid' },
    { id: '3', name: 'Charlie', position: 'Manager', level: 'Senior' },
];

const resolvers = {
    Record: {
        id: (parent: Record): string => parent.id,
    },
    Query: {
        record(_: unknown, { id }: { id: string }): Record | undefined {
            return mockData.find(record => record.id === id);
        },
        records(): Record[] {
            return mockData;
        },
    },
    Mutation: {
        createRecord(
            _: unknown,
            {
                name,
                position,
                level,
            }: { name: string; position?: string; level?: string },
        ): Record {
            const newRecord: Record = {
                id: (mockData.length + 1).toString(),
                name,
                position: position ?? '',
                level: level ?? '',
            };
            mockData.push(newRecord);
            return newRecord;
        },
        updateRecord(
            _: unknown,
            {
                id,
                name,
                position,
                level,
            }: { id: string; name?: string; position?: string; level?: string },
        ): Record | null {
            const recordIndex = mockData.findIndex(record => record.id === id);
            if (recordIndex === -1) return null;

            const updatedRecord: Record = {
                ...mockData[recordIndex],
                name: name ?? mockData[recordIndex].name,
                position: position ?? mockData[recordIndex].position,
                level: level ?? mockData[recordIndex].level,
            };

            mockData[recordIndex] = updatedRecord;
            return updatedRecord;
        },
        deleteRecord(_: unknown, { id }: { id: string }): boolean {
            const recordIndex = mockData.findIndex(record => record.id === id);
            if (recordIndex === -1) return false;

            mockData.splice(recordIndex, 1);
            return true;
        },
    },
};

export default resolvers;
