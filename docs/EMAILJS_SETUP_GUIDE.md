# EmailJS Setup Guide for Contact Form

## Step 1: Create EmailJS Account

1. Go to https://www.emailjs.com/
2. Click "Sign Up" (free account)
3. Verify your email

## Step 2: Connect Your Email Service

1. In EmailJS dashboard, go to **"Email Services"**
2. Click **"Add New Service"**
3. Choose your email provider:
   - **Gmail** (recommended for personal use)
   - **Outlook/Hotmail**
   - Or use **EmailJS** (their SMTP - no setup needed)
4. Follow the connection wizard
5. Copy your **Service ID** (looks like: `service_abc123`)

## Step 3: Create Email Template

1. Go to **"Email Templates"** in dashboard
2. Click **"Create New Template"**
3. Use this template content:

### Template Settings:
**Template Name:** Portfolio Contact Form

**Subject:**
```
New Contact: {{subject}}
```

**Content (HTML):**
```html
<h2>New Contact Form Submission</h2>

<p><strong>From:</strong> {{from_name}}</p>
<p><strong>Email:</strong> {{from_email}}</p>
<p><strong>Subject:</strong> {{subject}}</p>

<h3>Message:</h3>
<div style="padding: 15px; background-color: #f5f5f5; border-left: 4px solid #00D4FF;">
  {{message}}
</div>

<hr>
<p style="color: #666; font-size: 12px;">
  Sent from your portfolio website contact form
</p>
```

**To Email:** Your email address (where you want to receive messages)

**From Name:** `{{from_name}}`

**From Email:** `{{from_email}}`

**Reply To:** `{{from_email}}`

4. Click **"Save"**
5. Copy your **Template ID** (looks like: `template_xyz789`)

## Step 4: Get Your Public Key

1. Go to **"Account"** → **"General"** in dashboard
2. Find **"Public Key"** section
3. Copy your **Public Key** (looks like: `XYZ123abc-_DEF`)

## Step 5: Configure Environment Variables

Edit `/frontend/.env` file with your credentials:

```bash
REACT_APP_EMAILJS_SERVICE_ID=service_abc123
REACT_APP_EMAILJS_TEMPLATE_ID=template_xyz789
REACT_APP_EMAILJS_PUBLIC_KEY=XYZ123abc-_DEF
```

## Step 6: Restart Development Server

```bash
cd frontend
npm start
```

## Step 7: Test Contact Form

1. Open http://localhost:3000
2. Scroll to contact form
3. Fill out and submit
4. Check your email inbox!

## Troubleshooting

### Error: "EmailJS service unavailable"
- Check your Service ID is correct
- Verify your email service is connected and active

### Error: "Template not found"
- Verify Template ID is correct
- Make sure template is saved and published

### Not receiving emails?
- Check spam folder
- Verify "To Email" in template settings
- Check EmailJS dashboard logs for delivery status

### Rate Limiting
- Free tier: 200 emails/month
- If exceeded, upgrade plan or emails will fail
- Check usage in EmailJS dashboard

## Email Template Variables

Your form sends these variables:
- `{{from_name}}` - Name from form
- `{{from_email}}` - Email from form  
- `{{subject}}` - Selected subject
- `{{message}}` - Message text

## Production Deployment (Cloudflare)

When deploying to Cloudflare Pages:

1. Go to your Cloudflare Pages project settings
2. Navigate to **"Environment variables"**
3. Add the same variables:
   ```
   REACT_APP_EMAILJS_SERVICE_ID=service_abc123
   REACT_APP_EMAILJS_TEMPLATE_ID=template_xyz789
   REACT_APP_EMAILJS_PUBLIC_KEY=XYZ123abc-_DEF
   ```
4. Redeploy your site

## Security Notes

✅ EmailJS Public Key is safe to expose in frontend code (it's designed for client-side use)
✅ EmailJS has built-in rate limiting to prevent abuse
✅ Your actual email credentials are never exposed
✅ EmailJS handles all SMTP complexity

## Free Tier Limits

- 200 emails per month
- 2 email services
- Unlimited email templates
- Basic email support

If you exceed limits, upgrade to:
- **Personal:** $9/month - 1,000 emails
- **Business:** $29/month - 10,000 emails

## Support

- EmailJS Docs: https://www.emailjs.com/docs/
- EmailJS Dashboard: https://dashboard.emailjs.com/
- Check delivery logs in dashboard under "History"
