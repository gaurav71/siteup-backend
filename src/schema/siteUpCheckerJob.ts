import { Schema, Document, model, Model } from 'mongoose';

export const statusTypes = Object.freeze({
  RUNNING: 'RUNNING',
  PAUSED: 'PAUSED',
  STOPPED: 'STOPPED'
})

const siteUpCheckerJobSchema = new Schema<SiteUpCheckerJob, Model<SiteUpCheckerJob>>({
  userId: {
    type: String,
    required: true
  },
  url: {
    type: String,
    required: true,
  },
  cron: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
    enum: Object.values(statusTypes)
  },
  resetAfterDownCount: {
    type: Number
  },
  totalDownCounter: {
    type: Number,
    required: true,
    default: 0
  },
  downCounterBeforeReset: {
    type: Number,
    required: true,
    default: 0
  },
  lastCheckedOn: {
    type: Number
  },
  siteUpOnLastChecked: {
    type: Boolean
  },
  lastFailureOn: {
    type: Number
  },
  sendMailOnFailure: {
    type: Boolean,
    required: true
  },
  lastFailureEmailSentOn: {
    type: Number
  },
  createdOn: {
    type: Number,
    default: Date.now
  },
  lastUpdatedOn: {
    type: Number,
    default: Date.now
  }
});

siteUpCheckerJobSchema.virtual('id').get(function(
  this: SiteUpCheckerJob
) {
  return ''+this._id
})

export interface ISiteUpCheckerJob {
  userId: string;
  url: string;
  cron: string;
  status: string;
  resetAfterDownCount?: number;
  totalDownCounter: number;
  downCounterBeforeReset: number;
  sendMailOnFailure: boolean;
  lastCheckedOn?: number;
  siteUpOnLastChecked?: boolean;
  lastFailureOn?: number;
  lastFailureEmailSentOn?: number;
  createdOn: number;
  lastUpdatedOn: number;
}

interface SiteUpCheckerJob extends ISiteUpCheckerJob, Document {
  _id: string;
}

const SiteUpCheckerJob = model<SiteUpCheckerJob, Model<SiteUpCheckerJob>>('SiteUpCheckerJobs', siteUpCheckerJobSchema);

export default SiteUpCheckerJob