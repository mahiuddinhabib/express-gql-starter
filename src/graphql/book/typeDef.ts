export const BookTypeDef = `#graphql
    type Query {
        book(id: ID!): Book
        books: [Book]
    }

    type Mutation {
    createBook(input: CreateBookInput!): Book
    updateBook(id: ID!, input: UpdateBookInput!): Book
    deleteBook(id: ID!): Book
}

    type Book {
        id: ID!
        title: String!
        author: String!
        publishedDate: String!
        readingLists: [ReadingList]
        createdAt: String!
        updatedAt: String!
    }

    input CreateBookInput {
        title: String!
        author: String!
        publishedDate: String!
    }

    input UpdateBookInput {
        title: String
        author: String
        publishedDate: String
    }
`;
