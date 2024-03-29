import { Job } from 'bull'
import { SiteUpCheckerJob, User } from '../schema'
import { checkUrlStatus } from '../utilities/checkUrlStatus'
import { sendMail } from '../services/mailer'
import { siteDownEmailFormat } from '../utilities/messageFormatter'
import { UpdateQuery } from 'mongoose'
import { Mutable } from '../@types/mutable'
import AuditLog from '../schema/auditLog'
import { subscriptionTypes } from '../graphql'
import { pubsub } from '../services/graphql'
import { config } from '../config/config'

export const processJob = async (job: Job) => {
  const { url, jobId } = job.data

  const siteupCheckerJob = await SiteUpCheckerJob.findById(jobId).lean()

  if (!siteupCheckerJob) {
    return Promise.reject('job not found in database')
  }

  const isWebsiteUp = await checkUrlStatus(url)

  const now = Date.now()

  const updateObject: Mutable<UpdateQuery<SiteUpCheckerJob>> = {
    lastCheckedOn: now,
    siteUpOnLastChecked: isWebsiteUp
  }

  if (!isWebsiteUp) {
    updateObject.lastFailureOn = now
    
    updateObject.$inc = { totalDownCounter: 1 }

    const user = await User.findById(siteupCheckerJob.userId).lean()

    const sendMailOnFailure = user.sendMailOnFailure && siteupCheckerJob.sendMailOnFailure

    if (sendMailOnFailure) {
      const { downCounterBeforeReset, resetAfterDownCount } = siteupCheckerJob

      const downCounterLevelReached = downCounterBeforeReset + 1 >= resetAfterDownCount

      if (downCounterLevelReached) {
        Object.assign(updateObject, { downCounterBeforeReset: 0 })
      } else {
        Object.assign(updateObject.$inc, { downCounterBeforeReset: 1 })
      }

      if (downCounterLevelReached) {
        updateObject.lastFailureEmailSentOn = now
  
        const { subject, body } = siteDownEmailFormat({
          userName: user.userName,
          website: url,
          downTime: now
        })
  
        await sendMail({
          subject,
          body,
          from: config.officialEmail,
          to: user.email
        })
      }
    }
  }

  await new AuditLog({
    jobId: siteupCheckerJob._id,
    userId: siteupCheckerJob.userId,
    status: isWebsiteUp
  }).save()

  const updatedJob = await SiteUpCheckerJob.findOneAndUpdate(
    { _id: jobId },
    {
      ...updateObject,
      lastUpdatedOn: Date.now()
    }
  )

  pubsub.publish(subscriptionTypes.SITE_UP_CHECKERJOB_UPDATED, {
    siteUpCheckerJobUpdated: updatedJob
  })

  return Promise.resolve({
    url,
    isWebsiteUp
  })
}

