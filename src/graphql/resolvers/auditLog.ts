
import { Context } from '../../@types/context'
import { getSiteAuditLogsController, getSiteFailureAuditLogsController } from '../../controllers/auditLog'

export const getSiteAuditLogs = (parent: any, args: any, context: Context, info: any) => {
  return getSiteAuditLogsController(args.jobId, context)
}

export const getSiteFailureAuditLogs = (parent: any, args: any, context: Context, info: any) => {
  return getSiteFailureAuditLogsController(args.jobId,context)
}