import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { githubGetFile, githubStatus, githubWriteFile } from "./github-app.server";

const repoSchema = z.object({
  owner: z.string().min(1).max(100),
  repo: z.string().min(1).max(100),
});

export const getGitHubStatus = createServerFn({ method: "GET" })
  .validator(repoSchema)
  .handler(async ({ data }) => githubStatus(data.owner, data.repo));

export const readGitHubFile = createServerFn({ method: "GET" })
  .validator(
    repoSchema.extend({
      path: z.string().min(1).max(500),
      ref: z.string().max(200).optional(),
    }),
  )
  .handler(async ({ data }) => githubGetFile(data));

export const writeGitHubFile = createServerFn({ method: "POST" })
  .validator(
    repoSchema.extend({
      path: z.string().min(1).max(500),
      content: z.string().max(2_000_000),
      message: z.string().min(1).max(200),
      sha: z.string().optional(),
      branch: z.string().max(200).optional(),
    }),
  )
  .handler(async ({ data }) => githubWriteFile(data));
