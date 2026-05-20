import rateLimit from 'express-rate-limit'

// for public form submissions — 10 per 15 min per IP
export const formLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many submissions, please try again later' },
})
