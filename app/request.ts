import { z } from "zod";

const modifyPostSchema = z.object({
    title: z.string().max(55),
    content: z.string().max(255)
})

export { modifyPostSchema };