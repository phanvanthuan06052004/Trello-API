import { env } from '~/config/environment'

export const WHITELIST_DOMAINS = [
  'http://localhost:5173'
  // Sau này có domain nào muốn cho qua cors thì bỏ ở đây
]

// type của board
export const BOARD_TYPE = {
  PUBLIC: 'public',
  PRIVATE: 'private'
}

export const WEBSITE_DOMAIN = (env.BUILD_MODE === 'production') ? env.WEBSITE_DOMAIN_PRODUCTION : env.WEBSITE_DOMAIN_DEVELOPMENT

export const DEFAULT_PAGE = 1
export const DEFAULT_ITEMS_PER_PAGE = 12