import { Context } from "../@types/context"
import AuditLog from "../schema/auditLog"
import { checkAuth } from "../utilities/checkAuth"

export const getSiteAuditLogsController = async(jobId: string, context: Context) => {
  checkAuth(context)

  return AuditLog.find({ jobId })
}

export const getSiteFailureAuditLogsController = async(jobId: string, context: Context) => {
  checkAuth(context)

  return AuditLog.find({ jobId, status: false })
}
