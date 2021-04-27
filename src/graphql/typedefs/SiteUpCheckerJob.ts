import { gql } from "apollo-server-express";

export interface CreateSiteUpCheckerJobInput {
  url: string;
  cron: string;
  resetAfterDownCount: number;
  sendMailOnFailure: boolean;
}

export interface UpdateSiteUpCheckerJobInput {
  jobId: string;
  cron: string;
  sendMailOnFailure: boolean;
  resetAfterDownCount: number;
}

export const SiteUpCheckerJob = gql`
  type SiteUpCheckerJob {
    _id: String!
    userId: String!
    url: String!
    cron: String!
    status: String!
    resetAfterDownCount: Float!
    totalDownCounter: Float!
    downCounterBeforeReset: Float!
    lastCheckedOn: Float
    siteUpOnLastChecked: Boolean
    sendMailOnFailure: Boolean
    lastFailureOn: Float
    lastFailureEmailSentOn: Float
    createdOn: Float!
    lastUpdatedOn: Float!
  }

  input CreateSiteUpCheckerJobInput {
    url: String!
    cron: String!
    resetAfterDownCount: Float!
    sendMailOnFailure: Boolean!
  }

  input UpdateSiteUpCheckerJobInput {
    jobId: String!
    cron: String!
    resetAfterDownCount: Float!
    sendMailOnFailure: Boolean!
  }

  extend type Query {
    getSiteUpCheckerJobById(id: String!): SiteUpCheckerJob!
    getUserSiteUpCheckerJobs: [SiteUpCheckerJob!]!
  }

  extend type Mutation {
    createSiteUpCheckerJob(input: CreateSiteUpCheckerJobInput!): SiteUpCheckerJob!
    updateSiteUpCheckerJob(input: UpdateSiteUpCheckerJobInput!): SiteUpCheckerJob!
    pauseSiteUpCheckerJob(jobId: String!): SiteUpCheckerJob!
    startSiteUpCheckerJob(jobId: String!): SiteUpCheckerJob!
    removeSiteUpCheckerJob(jobId: String!): String!
    checkMultipleSitesStatus(jobIds: [String!]!): [SiteUpCheckerJob!]!
    checkAllUserSitesStatus: [SiteUpCheckerJob!]!
  }

  extend type Subscription {
    siteUpCheckerJobUpdated(userId: String!): SiteUpCheckerJob!
  }
`