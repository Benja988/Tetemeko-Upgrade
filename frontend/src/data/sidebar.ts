// data/sidebar.ts

export interface NavItem {
  label: string
  href: string
  subItems?: { label: string; href: string }[]
}

export const navItems: NavItem[] = [
  {
    label: 'Dashboard',
    href: '/admin/dashboard',
  },
  {
    label: 'Users',
    href: '/admin/dashboard/users',
    subItems: [
      { label: 'Registered Users', href: '/admin/dashboard/users' },
      { label: 'Authors', href: '/admin/dashboard/users/authors' },
    ],
  },
  {
    label: 'Stations',
    href: '/admin/dashboard/stations',
  },
  {
    label: 'News',
    href: '/admin/dashboard/news',
    subItems: [
      { label: 'All News', href: '/admin/dashboard/news' },
      { label: 'Create News', href: '/admin/dashboard/news/create' },
      { label: 'Categories', href: '/admin/dashboard/news/categories' },
    ],
  },
  {
    label: 'Podcasts',
    href: '/admin/dashboard/podcasts',
    subItems: [
      { label: 'All Podcasts', href: '/admin/dashboard/podcasts' },
      { label: 'Create Podcast', href: '/admin/dashboard/podcasts/create' },
      { label: 'Categories', href: '/admin/dashboard/podcasts/categories' },
    ],
  },
  {
    label: 'Marketplace',
    href: '/admin/dashboard/marketplace',
    subItems: [
      { label: 'All Products', href: '/admin/dashboard/marketplace' },
      { label: 'Add Product', href: '/admin/dashboard/marketplace/create' },
      { label: 'Categories', href: '/admin/dashboard/marketplace/categories' },
      { label: 'Orders', href: '/admin/dashboard/marketplace/orders' },
    ],
  },
  {
    label: 'Ads',
    href: '/admin/dashboard/ads',
    subItems: [
      { label: 'All Ads', href: '/admin/dashboard/ads' },
      { label: 'Create Ad', href: '/admin/dashboard/ads/create' },
      { label: 'Ad Campaigns', href: '/admin/dashboard/ads/campaigns' },
    ],
  },
  {
    label: 'Settings',
    href: '/admin/dashboard/settings',
    subItems: [
      { label: 'General', href: '/admin/dashboard/settings' },
      { label: 'Categories', href: '/admin/dashboard/settings/categories' },
      { label: 'Appearance', href: '/admin/dashboard/settings/appearance' },
    ],
  },
]
