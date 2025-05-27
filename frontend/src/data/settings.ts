import type { Setting } from "@/interfaces/Settings";

export const settings: Setting[] = [
  {
    id: 'companyName',
    label: 'Company Name',
    type: 'text',
    value: 'Acme Inc.',
    category: 'Company Info',
    description: 'Displayed on invoices and communication',
  },
  {
    id: 'profileImage',
    label: 'Profile Image URL',
    type: 'text',
    value: '',
    category: 'Appearance',
    description: 'URL for the profile/avatar image',
  },
  {
    id: 'bgImage',
    label: 'Background Image URL',
    type: 'text',
    value: '',
    category: 'Appearance',
    description: 'URL for dashboard banner background',
  },
  {
    id: 'twitter',
    label: 'Twitter Handle',
    type: 'text',
    value: '',
    category: 'Social Links',
    description: 'e.g. https://twitter.com/yourhandle',
  },
  {
    id: 'facebook',
    label: 'Facebook Page URL',
    type: 'text',
    value: '',
    category: 'Social Links',
    description: 'e.g. https://facebook.com/yourpage',
  },
  // More settings...
];
