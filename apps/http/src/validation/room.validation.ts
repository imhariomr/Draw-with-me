import { z } from "zod"

export const roomValidator = z.object({
    name: z.string().min(4, 'Canvas Name must be at least 4 characters long.'),
    description: z.string().max(100,'Description must not be longer than 100 words.')
})