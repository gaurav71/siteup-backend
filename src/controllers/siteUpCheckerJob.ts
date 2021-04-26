import { omit } from 'lodash'
import { Context } from "../@types/context"
import { CreateSiteUpCheckerJobInput, UpdateSiteUpCheckerJobInput } from "../graphql/typedefs/SiteUpCheckerJob"
import { SiteUpCheckerJob } from "../schema"
import { siteUpCheckerJobQueue } from '../services/Queues'
import { checkAuth } from "../utilities/checkAuth"
import { statusTypes as STATUS_TYPES } from '../schema/siteUpCheckerJob'
import { checkUrlStatus } from "../utilities/checkUrlStatus"
import AuditLog from '../schema/auditLog'

export const getSiteUpCheckerJobByIdController = async(jobId: string, context: Context) => {
  checkAuth(context)

  const job = await SiteUpCheckerJob.findById(jobId)

  if (!job || context.req.session.userId !== job.userId) {
    throw new Error("Job not found")
  }
  
  return SiteUpCheckerJob.findById(jobId)
}

export const getUserSiteUpCheckerJobsController = (context: Context) => {
  checkAuth(context)
  
  return SiteUpCheckerJob.find({ userId: context.req.session.userId })
}

export const createSiteUpCheckerJobController = async(createInput: CreateSiteUpCheckerJobInput, context: Context) => {
  checkAuth(context)

  const job = await new SiteUpCheckerJob({
    ...createInput,
    userId: context.req.session.userId,
    status: STATUS_TYPES.RUNNING
  }).save()

  siteUpCheckerJobQueue.addJob({
    jobId: job._id,
    url: job.url,
    cron: job.cron
  })

  return job
}

export const updateSiteUpCheckerJobController = async(updateInput: UpdateSiteUpCheckerJobInput, context: Context) => {
  checkAuth(context)

  const job = await SiteUpCheckerJob.findById(updateInput.jobId)

  if (!job || context.req.session.userId !== job.userId) {
    throw new Error('Job not found')
  }

  if (updateInput.cron !== job.cron) {
    siteUpCheckerJobQueue.updateJob({
      jobId: updateInput.jobId,
      prevCron: job.cron,
      url: job.url,
      cron: updateInput.cron
    })
  }

  return SiteUpCheckerJob.findOneAndUpdate(
    { _id: updateInput.jobId },
    {
      ...omit(updateInput, ['jobId']),
      lastUpdatedOn: Date.now()
    },
    { new: true }
  )
}

export const pauseSiteUpCheckerJobController = async(jobId: string, context: Context) => {
  checkAuth(context)

  const job = await SiteUpCheckerJob.findById(jobId)

  if (!job || context.req.session.userId !== job.userId) {
    throw new Error('Job not found')
  }

  siteUpCheckerJobQueue.removeJob({
    jobId: job._id,
    cron: job.cron
  })

  return SiteUpCheckerJob.findOneAndUpdate(
    { _id: jobId },
    {
      status: STATUS_TYPES.PAUSED,
      lastUpdatedOn: Date.now()
    },
    { new: true }
  )
}

export const startSiteUpCheckerJobController = async(jobId: string, context: Context) => {
  checkAuth(context)

  const job = await SiteUpCheckerJob.findById(jobId)

  if (!job || context.req.session.userId !== job.userId) {
    throw new Error('Job not found')
  }

  siteUpCheckerJobQueue.addJob({
    jobId: job._id,
    url: job.url,
    cron: job.cron
  })

  return SiteUpCheckerJob.findOneAndUpdate(
    { _id: jobId },
    {
      status: STATUS_TYPES.RUNNING,
      lastUpdatedOn: Date.now()
    },
    { new: true }
  )
}

export const removeSiteUpCheckerJobController = async(jobId: string, context: Context) => {
  checkAuth(context)
  
  const job = await SiteUpCheckerJob.findById(jobId)

  if (!job || context.req.session.userId !== job.userId) {
    throw new Error('Job not found')
  }

  siteUpCheckerJobQueue.removeJob({
    jobId: job._id,
    cron: job.cron
  })

  await SiteUpCheckerJob.deleteOne({ _id: jobId })

  return 'deleted successfully'
}

export const checkSiteStatusController = async(jobId: string, context: Context) => {
  checkAuth(context)
  
  const job = await SiteUpCheckerJob.findById(jobId)

  if (!job || context.req.session.userId !== job.userId) {
    throw new Error('Job not found')
  }

  const isWebsiteUp = await checkUrlStatus(job.url)

  await new AuditLog({
    jobId: job._id,
    userId: job.userId,
    status: isWebsiteUp
  }).save()

  return SiteUpCheckerJob.findOneAndUpdate(
    { _id: jobId },
    {
      lastCheckedOn: Date.now(),
      siteUpOnLastChecked: isWebsiteUp,
      lastFailureOn: isWebsiteUp ? job.lastFailureOn : Date.now(),
      lastUpdatedOn: Date.now()
    },
    { new: true }
  )
}

export const checkMultipleSitesStatusController = async(jobIds: string[], context: Context) => {
  checkAuth(context)

  const checkUserJobs = await Promise.all(jobIds.map((jobId) => checkSiteStatusController(jobId, context)))

  return checkUserJobs
}

export const checkAllUserSitesStatusController = async(context: Context) => {
  checkAuth(context)

  const userJobs = await SiteUpCheckerJob.find({ userId: context.req.session.userId })

  const checkUserJobs = await Promise.all(userJobs.map((job) => checkSiteStatusController(job._id, context)))

  return checkUserJobs
}
