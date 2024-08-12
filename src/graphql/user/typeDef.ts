export const UserTypeDef = `#graphql
    type Query {
        users: [User]
        user(id: ID!): User
    }

    type Mutation {
        createUser(input: CreateUserInput!): User
        updateUser(id: ID!, input: UpdateUserInput!): User
        deleteUser(id: ID!): User
    }

    type User {
        id: ID
        name: String
        email: String
        role: UserRole
        createdAt: String
        updatedAt: String
    }

    input CreateUserInput {
        name: String!
        email: String!
        password: String!
        role: UserRole
    }

    input UpdateUserInput {
        name: String
        email: String
        password: String
        role: UserRole
    }

    enum UserRole {
        librarian
        user
    }
`;
