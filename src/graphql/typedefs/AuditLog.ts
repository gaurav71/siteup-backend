import { gql } from "apollo-server-express";

export const AuditLog = gql`
  type AuditLog {
    userId: String!
    jobId: String!
    status: Boolean!
    createdOn: Float!
  }

  extend type Query {
    getSiteAuditLogs(jobId: String!): AuditLog!
    getSiteFailureAuditLogs(jobId: String!): AuditLog!
  }
`