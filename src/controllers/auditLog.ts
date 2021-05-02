import { Context } from "../@types/context"
import { GetAuditLogsInput } from "../graphql/typedefs/AuditLog"
import AuditLog from "../schema/auditLog"
import { checkAuth } from "../utilities/checkAuth"

export const getSiteAuditLogsController = async(input: GetAuditLogsInput, context: Context) => {
  checkAuth(context)

  const resolvedCursor = input.cursor ? input.cursor : Number.MAX_VALUE

  return AuditLog.aggregate([
    { $match: { jobId: input.jobId } },
    { $sort: { createdOn: -1 } },
    { $match: { createdOn: { $lt: resolvedCursor } } },
    { $limit: input.limit }
  ])
}

export const getSiteFailureAuditLogsController = async(input: GetAuditLogsInput, context: Context) => {
  checkAuth(context)

  const resolvedCursor = input.cursor ? input.cursor : Number.MAX_VALUE

  return AuditLog.aggregate([
    { $match: { jobId: input.jobId } },
    { $sort: { createdOn: -1 } },
    { $match: { createdOn: { $lt: resolvedCursor } } },
    { $limit: input.limit }
  ])
}
