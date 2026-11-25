---
name: deploy-to-vercel
description: Deploy applications and websites to Vercel. Use when the user requests deployment actions like "deploy my app", "deploy and give me the link", "push this live", or "create a preview deployment".
---

# Deploy to Vercel

Deploy any project to Vercel. **Always deploy as a preview** (not production) unless the user explicitly asks for production.

## Step 1: Gather Project State

Check the local project and Vercel CLI status before choosing a deployment method:

```bash
# 1. Check for a git remote
git remote get-url origin 2>/dev/null

# 2. Check if locally linked to a Vercel project
cat .vercel/project.json 2>/dev/null || cat .vercel/repo.json 2>/dev/null

# 3. Check if Vercel CLI is installed and authenticated
vercel whoami 2>/dev/null
```

## Step 2: Choose a Deploy Method

### Method A: Linked Project or Authenticated Vercel CLI

1. **Linked (`.vercel/` exists) + git remote**: Ask the user for approval before committing/pushing (`git push`), then check deployment status with `vercel ls --format json`.
2. **Linked (`.vercel/` exists) + no git remote**: Run:
   ```bash
   vercel deploy [path] -y --no-wait
   ```
   Check status with `vercel inspect <deployment-url>`. (Add `--prod` only if the user explicitly requests production.)
3. **Not linked + CLI authenticated**: Link with `vercel link --repo` (if git remote exists) or `vercel link`, then deploy as above.
4. **CLI no-auth temporary deploy**:
   ```bash
   npx vercel@latest deploy [path] --temporary -y
   ```

### Method B: Bundled Claimable Deploy Scripts (`resources/`)

When running in an environment without Vercel CLI authentication (or when a quick claimable preview URL is desired), use the bundled helper scripts in `resources/`:

| Script | Endpoint | Use Case |
| :--- | :--- | :--- |
| [resources/deploy.sh](resources/deploy.sh) | `https://claude-skills-deploy.vercel.com/api/deploy` | Standard Bash environments |
| [resources/deploy-codex.sh](resources/deploy-codex.sh) | `https://codex-deploy-skills.vercel.sh/api/deploy` | Codex / sandboxed environments |

#### Usage

```bash
bash resources/deploy.sh [project-path-or-tgz]
```

#### What the Script Does

1. **Framework Detection**: Reads `package.json` to auto-detect frameworks (`nextjs`, `vite`, `astro`, `sveltekit-1`, `nuxtjs`, `remix`, `angular`, etc.). If no `package.json` exists, deploys as static HTML and renames a single root `*.html` file to `index.html` in the staging archive.
2. **Safe Staging**: Copies files into a temporary directory excluding `node_modules`, `.git`, `.env`, and `.env.*`.
   - **Important**: If `.vercelignore` is present in the project root, the script fails closed to prevent accidentally uploading excluded or sensitive files. Either remove/review `.vercelignore` or pass a pre-reviewed `.tgz` archive.
3. **Upload & Poll**: Packages a `.tgz` tarball, submits it to the claimable deploy endpoint, and polls the preview URL until the build finishes (up to 5 minutes).
4. **JSON Output**: Prints progress to `stderr` and outputs the final JSON (`previewUrl`, `claimUrl`, `deploymentId`, `projectId`) to `stdout`.

## Output

Always present the user with:
- **Preview URL** (`previewUrl` or CLI deployment URL)
- **Claim URL** (`claimUrl`, if using a claimable/temporary deployment) — remind the user not to share the claim link publicly.

Do not curl or fetch the deployed URL solely to test it unless the user explicitly asks to verify the live endpoint.
