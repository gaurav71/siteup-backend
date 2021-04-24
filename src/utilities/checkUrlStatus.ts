import isReachable from "is-reachable"

export const checkUrlStatus = (url: string): Promise<boolean> => new Promise((resolve, reject) => {
  isReachable(url).then((result) => resolve(result)).catch((error) => reject(error))
})