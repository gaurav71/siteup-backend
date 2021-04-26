import { Schema, Document, model, Model } from 'mongoose';

export const statusTypes = Object.freeze({
  RUNNING: 'RUNNING',
  PAUSED: 'PAUSED',
  STOPPED: 'STOPPED'
})

const auditLogSchema = new Schema<AuditLog, Model<AuditLog>>({
  userId: {
    type: String,
    required: true
  },
  jobId: {
    type: String,
    required: true
  },
  status: {
    type: Boolean,
    required: true
  },
  createdOn: {
    type: String,
    required: true,
    default: Date.now
  }
});

auditLogSchema.virtual('id').get(function(
  this: AuditLog
) {
  return ''+this._id
})

auditLogSchema.index({
  jobId: 1,
  userId: 1
})

export interface IAuditLog {
  userId: string;
  jobId: string;
  status: boolean;
  createdOn: number;
}

interface AuditLog extends IAuditLog, Document {
  _id: string;
}

const AuditLog = model<AuditLog, Model<AuditLog>>('AuditLogs', auditLogSchema);

export default AuditLog