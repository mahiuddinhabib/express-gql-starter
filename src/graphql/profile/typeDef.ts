export const ProfileTypeDef = `#graphql
    type Query {
        profile: Profile
    }

    type Mutation {
        updateProfile(input: UpdateProfileInput!): Profile
    }

    type Profile {
        id: ID!
        fullName: String!
        phoneNumber: String
        address: String
        profilePhoto: String
        user: User!
        createdAt: String!
        updatedAt: String!
    }

    input UpdateProfileInput {
        fullName: String
        phoneNumber: String
        address: String
        profilePhoto: String
    }
`;
