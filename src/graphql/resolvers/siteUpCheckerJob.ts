import { Context } from "../../@types/context"

import {
  CreateSiteUpCheckerJobInput,
  UpdateSiteUpCheckerJobInput
} from "../typedefs/SiteUpCheckerJob"

import {
  checkAllUserSitesStatusController,
  checkMultipleSitesStatusController,
  createSiteUpCheckerJobController,
  getSiteUpCheckerJobByIdController,
  getUserSiteUpCheckerJobsController,
  pauseSiteUpCheckerJobController,
  removeSiteUpCheckerJobController,
  startSiteUpCheckerJobController,
  updateSiteUpCheckerJobController
} from "../../controllers/siteUpCheckerJob"

export const createSiteUpCheckerJob = (parent: any, args: { input: CreateSiteUpCheckerJobInput }, context: Context, info: any) => {
  return createSiteUpCheckerJobController(args.input, context)
}

export const getSiteUpCheckerJobById = (parent: any, args: { id: string }, context: Context, info: any) => {
  return getSiteUpCheckerJobByIdController(args.id, context)
}

export const getUserSiteUpCheckerJobs = (parent: any, args: any, context: Context, info: any) => {
  return getUserSiteUpCheckerJobsController(context)
}

export const updateSiteUpCheckerJob = (parent: any, args: { input: UpdateSiteUpCheckerJobInput }, context: Context, info: any) => {
  return updateSiteUpCheckerJobController(args.input, context)
}

export const pauseSiteUpCheckerJob = (parent: any, args: { jobId: string }, context: Context, info: any) => {
  return pauseSiteUpCheckerJobController(args.jobId, context)
}

export const startSiteUpCheckerJob = (parent: any, args: { jobId: string }, context: Context, info: any) => {
  return startSiteUpCheckerJobController(args.jobId, context)
}

export const removeSiteUpCheckerJob = (parent: any, args: { jobId: string }, context: Context, info: any) => {
  return removeSiteUpCheckerJobController(args.jobId, context)
}

export const checkMultipleSitesStatus = (parent: any, args: { jobIds: string[] }, context: Context, info: any) => {
  return checkMultipleSitesStatusController(args.jobIds, context)
}

export const checkAllUserSitesStatus = (parent: any, args: any, context: Context, info: any) => {
  return checkAllUserSitesStatusController(context)
}

// export const siteUpCheckerJobUpdated = {
//   subscribe: () => pubsub.asyncIterator(['POST_CREATED'])
// }
