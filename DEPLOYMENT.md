# Deployment Guide

## 🚀 Quick Deploy Options

### **1. Vercel (Recommended)**

Vercel is the easiest option for Next.js apps:

1. **Install Vercel CLI:**

   ```bash
   npm i -g vercel
   ```

2. **Deploy:**

   ```bash
   vercel
   ```

3. **Or connect to GitHub:**
   - Push your code to GitHub
   - Go to [vercel.com](https://vercel.com)
   - Import your repository
   - Vercel will automatically detect Next.js and deploy

### **2. Netlify**

1. **Build locally:**

   ```bash
   npm run build
   ```

2. **Deploy:**
   - Go to [netlify.com](https://netlify.com)
   - Drag and drop the `.next` folder
   - Or connect to GitHub for automatic deployments

### **3. Railway**

1. **Install Railway CLI:**

   ```bash
   npm i -g @railway/cli
   ```

2. **Deploy:**
   ```bash
   railway login
   railway init
   railway up
   ```

## 🐳 Docker Deployment

### **Create Dockerfile:**

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

### **Deploy with Docker:**

```bash
docker build -t resume-wizkid .
docker run -p 3000:3000 resume-wizkid
```

## ☁️ Cloud Platform Options

### **AWS Amplify**

1. Install Amplify CLI: `npm install -g @aws-amplify/cli`
2. Initialize: `amplify init`
3. Deploy: `amplify push`

### **Google Cloud Run**

1. Build: `gcloud builds submit --tag gcr.io/PROJECT_ID/resume-wizkid`
2. Deploy: `gcloud run deploy --image gcr.io/PROJECT_ID/resume-wizkid`

### **Azure Static Web Apps**

1. Install Azure CLI
2. Deploy: `az staticwebapp create --name resume-wizkid --source .`

## 🔧 Environment Variables

If you need to set environment variables for your API keys:

### **Vercel:**

```bash
vercel env add OPENAI_API_KEY
```

### **Netlify:**

- Go to Site Settings > Environment Variables
- Add your API keys

### **Railway:**

```bash
railway variables set OPENAI_API_KEY=your_key_here
```

## 📝 Pre-deployment Checklist

- [ ] Test build locally: `npm run build`
- [ ] Test production: `npm start`
- [ ] Check all routes work
- [ ] Verify file upload functionality
- [ ] Test API integrations
- [ ] Set environment variables

## 🎯 Recommended: Vercel

For this Next.js project, **Vercel is the best choice** because:

1. **Zero configuration** - automatically detects Next.js
2. **Automatic deployments** from GitHub
3. **Built-in analytics** and performance monitoring
4. **Edge functions** for API routes
5. **Automatic HTTPS** and CDN
6. **Free tier** is generous

### **Quick Vercel Deploy:**

```bash
npm i -g vercel
vercel --prod
```

Your app will be live in minutes! 🚀
