import { gql } from "apollo-server-express";

export interface GetAuditLogsInput {
  jobId: string;
  cursor?: number;
  limit: number;
}

export const AuditLog = gql`
  type AuditLog {
    _id: String!
    userId: String!
    jobId: String!
    status: Boolean!
    createdOn: Float!
  }

  input GetAuditLogsInput {
    jobId: String!
    cursor: Float
    limit: Float!
  }

  extend type Query {
    getSiteAuditLogs(input: GetAuditLogsInput!): [AuditLog!]!
    getSiteFailureAuditLogs(input: GetAuditLogsInput!): [AuditLog!]!
  }
`