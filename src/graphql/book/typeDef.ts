export const BookTypeDef = `#graphql
    type Query {
        book(id: ID!): Book
        books(
            page: Int = 1, 
            limit: Int = 10, 
            sortBy: String = "title", 
            sortOrder: String = "ASC"
            search: String,
            filter: BookFilterInput
        ): PaginatedBooks
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

    type PaginatedBooks {
        page: Int
        limit: Int
        total: Int
        totalPages: Int
        books: [Book]
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

    input BookFilterInput {
        author: String
        publishedDate: String
    }
`;
