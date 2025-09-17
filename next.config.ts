import type { NextConfig } from 'next'

const isGhPages = process.env.GITHUB_PAGES === 'true'
const repo = process.env.GITHUB_REPOSITORY?.split('/')[1]
const basePath = isGhPages && repo ? `/${repo}` : ''

const nextConfig: NextConfig = {
  output: 'export',
  images: { unoptimized: true },
  trailingSlash: true,
  basePath,
  assetPrefix: basePath ? `${basePath}/` : undefined,
}

export default nextConfig
