import { gql } from "apollo-server-express";

export interface CreateUserInput {
  userName: string;
  email: string;
  password: string;
}

export interface LoginUserInput {
  email: string;
  password: string;
}

export interface UpdateUserInput {
  sendMailOnFailure: boolean;
}

export const user = gql`
  type User {
    _id: String!
    userName: String!
    email: String!
    userType: String!
    sendMailOnFailure: Boolean!
  }

  input CreateUserInput {
    userName: String!
    email: String!
    password: String!
  }

  input LoginUserInput {
    email: String!
    password: String!
  }

  input UpdateUserInput {
    sendMailOnFailure: Boolean!
  }

  extend type Query {
    user: User!
    login(input: LoginUserInput!): User!
  }

  extend type Mutation {
    createUser(input: CreateUserInput!): String!
    verifyUser(token: String!): User!
    updateUser(input: UpdateUserInput!): User!
    resenedVericiationMail(email: String!): String!
    logout: String!
  }
`