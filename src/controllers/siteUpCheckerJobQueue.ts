import { Job } from 'bull'
import { SiteUpCheckerJob, User } from '../schema'
import { checkUrlStatus } from '../utilities/checkUrlStatus'
import { sendMail } from '../services/mailer'
import { siteDownEmailFormat } from '../utilities/textFormatter'
import { UpdateQuery } from 'mongoose'
import { Mutable } from '../@types/mutable'

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

    const { downCounterBeforeReset, resetAfterDownCount } = siteupCheckerJob

    const downCounterLevelReached = downCounterBeforeReset + 1 >= resetAfterDownCount

    if (downCounterLevelReached) {
      Object.assign(updateObject, { downCounterBeforeReset: 0 })
    } else {
      Object.assign(updateObject.$inc, { downCounterBeforeReset: 1 })
    }

    if (downCounterLevelReached && sendMailOnFailure) {
      updateObject.lastFailureEmailSentOn = now

      const { subject, body } = siteDownEmailFormat({
        userName: user.userName,
        website: url,
        downTime: now
      })

      await sendMail({
        subject,
        body,
        from: "test@test.com",
        to: user.email
      })
    }
  }

  await SiteUpCheckerJob.findOneAndUpdate(
    { _id: jobId },
    {
      ...updateObject,
      lastUpdatedOn: Date.now()
    }
  )

  return Promise.resolve({
    url,
    isWebsiteUp
  })
}

