# Cloudflare Pages Deployment Setup

This repository is configured to automatically deploy to Cloudflare Pages when code is pushed to the `main` branch.

## Prerequisites

1. A Cloudflare account
2. A Cloudflare Pages project created
3. GitHub repository with proper access

## Setup Instructions

### 1. Create a Cloudflare Pages Project

1. Log in to your [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Navigate to **Pages** in the left sidebar
3. Click **Create a project**
4. Choose **Direct Upload** (not Git integration, since we're using GitHub Actions)
5. Name your project (e.g., `portfolio-website`)
6. Note down your **Account ID** and **Project Name**

### 2. Generate Cloudflare API Token

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Navigate to **My Profile** → **API Tokens**
3. Click **Create Token**
4. Use the **Edit Cloudflare Workers** template or create a custom token with:
   - **Permissions:**
     - Account - Cloudflare Pages - Edit
   - **Account Resources:**
     - Include - Your Account
5. Click **Continue to summary** → **Create Token**
6. **Copy the token** (you won't be able to see it again!)

### 3. Find Your Cloudflare Account ID

1. Go to your [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Click on **Workers & Pages**
3. Your **Account ID** is displayed on the right sidebar
4. Alternatively, you can find it in the URL when viewing your account or in the API token page

### 4. Configure GitHub Secrets

Add the following secrets to your GitHub repository:

1. Go to your GitHub repository
2. Navigate to **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret** and add each of the following:

#### Required Secrets:

- **`CLOUDFLARE_API_TOKEN`**
  - Value: The API token you generated in step 2
  
- **`CLOUDFLARE_ACCOUNT_ID`**
  - Value: Your Cloudflare Account ID from step 3

#### Optional Secrets (Environment Variables):

- **`REACT_APP_BACKEND_URL`**
  - Value: Your backend API URL (e.g., `https://api.yourdomain.com`)
  
- **`REACT_APP_EMAILJS_SERVICE_ID`**
  - Value: Your EmailJS service ID
  
- **`REACT_APP_EMAILJS_TEMPLATE_ID`**
  - Value: Your EmailJS template ID
  
- **`REACT_APP_EMAILJS_PUBLIC_KEY`**
  - Value: Your EmailJS public key

### 5. Update Workflow Configuration

Edit `.github/workflows/cloudflare-pages.yml` if needed:

```yaml
projectName: portfolio-website  # Change to your Cloudflare Pages project name
directory: frontend/build        # Build output directory
```

### 6. Deploy

Once everything is configured, simply push to the `main` branch:

```bash
git add .
git commit -m "Setup Cloudflare Pages deployment"
git push origin main
```

The GitHub Action will automatically:
1. ✅ Install dependencies
2. ✅ Build the project
3. ✅ Deploy to Cloudflare Pages

### 7. Monitor Deployment

- **GitHub Actions:** Check the **Actions** tab in your GitHub repository to monitor the workflow
- **Cloudflare Dashboard:** View deployment status in **Workers & Pages** → Your Project

## Deployment URLs

- **Production:** `https://portfolio-website.pages.dev` (or your custom domain)
- **Preview:** Each pull request gets a unique preview URL

## Troubleshooting

### Build Fails

- Check the build logs in GitHub Actions
- Ensure all environment variables are set correctly
- Verify the build command works locally: `cd frontend && yarn build`

### Deployment Fails

- Verify `CLOUDFLARE_API_TOKEN` has correct permissions
- Check `CLOUDFLARE_ACCOUNT_ID` is correct
- Ensure the project name matches your Cloudflare Pages project

### Environment Variables Not Working

- Make sure secrets are added in GitHub repository settings
- Check secret names match exactly (case-sensitive)
- Redeploy after adding new secrets

## Custom Domain

To add a custom domain:

1. Go to your Cloudflare Pages project
2. Click **Custom domains**
3. Click **Set up a custom domain**
4. Follow the instructions to configure DNS

## Branch Deployments

- **main branch** → Production deployment
- **Pull requests** → Preview deployments (unique URLs)

Each preview deployment gets a URL like: `https://abc123.portfolio-website.pages.dev`

## Additional Resources

- [Cloudflare Pages Documentation](https://developers.cloudflare.com/pages/)
- [Cloudflare Pages GitHub Action](https://github.com/cloudflare/pages-action)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
