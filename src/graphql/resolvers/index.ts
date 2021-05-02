import {
  createUser,
  updateUser,
  verifyUser,
  resenedVericiationMail,
  login,
  logout,
  user
} from "./user";

import {
  createSiteUpCheckerJob,
  getSiteUpCheckerJobById,
  getUserSiteUpCheckerJobs,
  pauseSiteUpCheckerJob,
  removeSiteUpCheckerJob,
  updateSiteUpCheckerJob,
  checkMultipleSitesStatus,
  checkAllUserSitesStatus,
  startSiteUpCheckerJob,
  siteUpCheckerJobUpdated
} from "./siteUpCheckerJob";

import {
  getSiteAuditLogs,
  getSiteFailureAuditLogs
} from './auditLog'

export const queries = {
  user,
  login,
  getSiteUpCheckerJobById,
  getUserSiteUpCheckerJobs,
  getSiteAuditLogs,
  getSiteFailureAuditLogs
}

export const mutations = {
  createUser,
  updateUser,
  verifyUser,
  logout,
  createSiteUpCheckerJob,
  updateSiteUpCheckerJob,
  pauseSiteUpCheckerJob,
  startSiteUpCheckerJob,
  removeSiteUpCheckerJob,
  checkMultipleSitesStatus,
  checkAllUserSitesStatus,
  resenedVericiationMail
}

export const subscriptions = {
  siteUpCheckerJobUpdated
}
