// form validation on client side
import * as z from "zod"

export const QuestionsSchema = z.object({
  title: z.string().min(5).max(130),
  explanation: z.string().min(20),
  tags: z.array(z.string().min(1).max(15)).min(1).max(3),
})

export const AnswersSchema = z.object({
  answer: z.string().min(20),
})

export const ProfileSchema = z.object({
  name: z.string().min(5).max(30),
  username: z.string().min(5).max(30),
  // email: z.string().email(),
  portfolioWebsite: z.string().url(),
  location: z.string().min(2).max(50),
  bio: z.string().min(5).max(200),
})
