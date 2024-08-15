export const UserTypeDef = `#graphql
    type Query {
        login(input: LoginInput!): AuthPayload
    }

    type Mutation {
        register(input: RegisterInput!): AuthPayload
    }

    type User {
        id: ID!
        email: String!
        role: UserRole!
        createdAt: String!
        updatedAt: String!
        profile: Profile
        readingLists: [ReadingList]!
    }

    input LoginInput {
        email: String!
        password: String!
    }

    input RegisterInput {
        fullName: String!
        email: String!
        password: String!
        role: String
    }
        
    type AuthPayload {
        accessToken: String
        user: User
    }

    enum UserRole {
        librarian
        user
    }
`;
