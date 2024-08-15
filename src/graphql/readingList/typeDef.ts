export const readingListTypeDef = `#graphql
    type Query {
        readingList(id: ID!): ReadingList
        readingLists: [ReadingList]
    }

    type Mutation {
        createReadingList(title: String!): ReadingList
        updateReadingList(id: ID!, title: String): ReadingList
        deleteReadingList(id: ID!): ReadingList
        addBookToReadingList(readingListId: ID!, bookId: ID!): ReadingList
        removeBookFromReadingList(readingListId: ID!, bookId: ID!): ReadingList
    }

    type ReadingList {
        id: ID!
        title: String!
        user: User
        books: [Book]
        createdAt: String!
        updatedAt: String!
    }
`;
