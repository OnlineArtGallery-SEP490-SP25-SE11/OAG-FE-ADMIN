import { z } from "zod";

export const blogSchema = z.object({
  _id: z.string(),
  title: z.string(),
  content: z.string(),
  image: z.string(),
  published: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date(),
  heartCount: z.number(),
  author: z.object({
    _id: z.string(),
    name: z.string(),
    image: z.string(),
  }),
  views: z.number(),
  tags: z.array(z.string()),
  status: z.enum(["pending", "published"]).optional().default("pending"),
});
export type Blog = z.infer<typeof blogSchema>;
export type PageInfo = {
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  startCursor: string;
  endCursor: string;
};
export type BlogEdge = {
  node: Blog & {
    author: {
      _id: string;
      name: string;
      image: string;
    };
  };
  cursor: string;
};

export type GetPublishedBlogsResponse = {
  edges: BlogEdge[];
  total: number;
  pageInfo: {
    hasNextPage: boolean;
    endCursor: string;
  };
};