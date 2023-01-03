import { Router } from 'express'
import { loginGoogleOauthUser } from '../controllers/user'
const router = Router()

router.post('/google', async (req, res) => {
  try {
    const data = req.body
    const result = await loginGoogleOauthUser(req, data)
    res.json(result)
  } catch (error) {
    res.json(error)
  }
})

export default router