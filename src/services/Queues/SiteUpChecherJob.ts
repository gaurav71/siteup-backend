import BullQueue, { Job, JobStatus } from 'bull'
import { omit } from 'lodash'
import { queueNames } from './queueNames'
import { processJob } from '../../controllers/siteUpCheckerJobQueue'
import { SiteUpCheckerJob } from '../../schema'
import { statusTypes as STATUS_TYPES } from '../../schema/siteUpCheckerJob'
import { config } from '../../config/config'

interface SiteUpCheckerJobQueueData {
  jobId: string;
  url: string;
  cron: string;
}

const getActiveJobIds = () => {
  return SiteUpCheckerJob.find(
    { status: STATUS_TYPES.RUNNING }
  ).lean()
}

const nonFailureJobTypes: JobStatus[] = [
  'active',
  'waiting',
  'completed',
  'delayed',
  'paused'
]

class SiteUpChecherJobQueue extends BullQueue {
  // jobs with attached process
  activeJobs = new Set()

  constructor() {
    super(queueNames.SITE_UP_CHECKER_JOB_QUEUE, { redis: config.redis })

    this.on('active', this.onActive)
    this.on('completed', this.onCompleted)
    this.on('stalled', this.onStalled)
    this.on('failed', this.onFailed)
    this.on('paused', this.onPaused)
    this.on('waiting', this.onWait)
    
    getActiveJobIds().then((jobs) => {
      this.getJobs(nonFailureJobTypes).then((qJobs) => {
        jobs.forEach((job) => {
          if (qJobs.find((qJob) => qJob.name === ''+job._id)) {
            this.process(''+job._id, processJob)
            this.activeJobs.add(''+job._id)
          } else {
            this.addJob({
              jobId: job._id,
              url: job.url,
              cron: job.cron
            })
          }
        })
      })
    })
  }

  addJob(input: SiteUpCheckerJobQueueData) {
    console.log('adding sitUpCheckerQueue job in queue', JSON.stringify(input, null, 2))

    const { jobId, cron } = input

    if (!this.activeJobs.has(''+jobId)) {
      this.process(''+jobId, processJob)
      this.activeJobs.add(''+jobId)
    }
  
    this.add(''+jobId, input, { repeat: { cron } })
  }

  updateJob(input: SiteUpCheckerJobQueueData & { prevCron: string }) {
    this.removeJob(omit(input, ['url', 'prevCron']))
    this.addJob(omit(input, ['prevCron']))
  }

  removeJob(input: Omit<SiteUpCheckerJobQueueData, 'url'>) {
    console.log('removing sitUpCheckerQueue job from queue', JSON.stringify(input, null, 2))

    const { jobId, cron } = input

    this.removeRepeatable(''+jobId, { cron })
  }

  private onActive = (job: Job) => {
    console.log( `Processing sitUpCheckerQueue job ${JSON.stringify(job.data, null, 2)}`,)
  }

  private onCompleted = (job: Job) => {
    console.log( `Completed sitUpCheckerQueue job ${JSON.stringify(job.data, null, 2)}`,)
  }

  private onFailed = (job: Job) => {
    console.log( `Failed sitUpCheckerQueue job ${JSON.stringify(job.data, null, 2)}`,)
  }

  private onPaused = () => {
    console.log('sitUpCheckerQueue paused')
  }

  private onStalled = (job: Job) => {
    console.log( `Stalled sitUpCheckerQueue job ${JSON.stringify(job.data, null, 2)}`,)
  }

  private onWait = (jobId: number | string) => {
    console.log( `Waiting sitUpCheckerQueue job ${jobId}`,)
  }
}

const queue = new SiteUpChecherJobQueue()

export default queue