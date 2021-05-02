
import { Context } from '../../@types/context'
import { getSiteAuditLogsController, getSiteFailureAuditLogsController } from '../../controllers/auditLog'
import { GetAuditLogsInput } from '../typedefs/AuditLog'

export const getSiteAuditLogs = (parent: any, args: { input: GetAuditLogsInput }, context: Context, info: any) => {
  return getSiteAuditLogsController(args.input, context)
}

export const getSiteFailureAuditLogs = (parent: any, args: { input: GetAuditLogsInput }, context: Context, info: any) => {
  return getSiteFailureAuditLogsController(args.input,context)
}