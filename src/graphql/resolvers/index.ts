import {
  createUser,
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
  startSiteUpCheckerJob
} from "./siteUpCheckerJob";

export const queries = {
  user,
  login,
  getSiteUpCheckerJobById,
  getUserSiteUpCheckerJobs
}

export const mutations = {
  createUser,
  logout,
  createSiteUpCheckerJob,
  updateSiteUpCheckerJob,
  pauseSiteUpCheckerJob,
  startSiteUpCheckerJob,
  removeSiteUpCheckerJob,
  checkMultipleSitesStatus,
  checkAllUserSitesStatus
}