import { Schema, Document, model, Model } from 'mongoose';

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
    type: Number,
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