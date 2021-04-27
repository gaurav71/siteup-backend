import { AuditLog } from './AuditLog'
import { root } from "./root"
import { SiteUpCheckerJob } from "./SiteUpCheckerJob"
import { user } from "./User"

const schemaArray = [
  root,
  user,
  SiteUpCheckerJob,
  AuditLog
]

export {
  schemaArray
}