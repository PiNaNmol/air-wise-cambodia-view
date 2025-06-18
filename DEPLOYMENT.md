
# Cambodia Air Quality Monitor - Deployment Guide

## GitHub Pages Deployment

This project is configured for automatic deployment to GitHub Pages using GitHub Actions.

### Setup Instructions

1. **Enable GitHub Pages**:
   - Go to your repository Settings → Pages
   - Under "Source", select "GitHub Actions"
   - The site will be available at: `https://yourusername.github.io/cambodia-air-quality-monitor/`

2. **Automatic Deployment**:
   - Every push to the `main` branch triggers an automatic build and deployment
   - The GitHub Action workflow is located in `.github/workflows/deploy.yml`

3. **Custom Domain (Optional)**:
   - Add a `CNAME` file to the `public` directory with your custom domain
   - Configure DNS settings with your domain provider
   - Update the `base` URL in `vite.config.ts` if using a custom domain

### Build Configuration

- **Static Build**: The project builds to a static site in the `dist` directory
- **Base URL**: Configured for GitHub Pages subdirectory deployment
- **Assets**: All assets are bundled and optimized for production

### Security Headers

Basic security headers are configured in `public/_headers` for enhanced security:
- X-Frame-Options: DENY
- X-Content-Type-Options: nosniff
- Referrer-Policy: strict-origin-when-cross-origin
- Permissions-Policy: camera=(), microphone=(), geolocation=()

### Local Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Environment Configuration

The project uses mock data and doesn't require environment variables for basic functionality. All data is generated client-side for Cambodia locations.

### Performance Optimizations

- Code splitting enabled
- Asset optimization
- Lightweight bundle size
- Responsive design for all devices
- Fast loading times optimized for mobile connections

### Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile browsers (iOS Safari, Chrome Mobile)
- Progressive enhancement for older browsers
