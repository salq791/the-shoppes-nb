import type { GlobalConfig } from 'payload'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'siteName',
      type: 'text',
      required: true,
      defaultValue: 'The Shoppes at New Brunswick',
    },
    {
      name: 'tagline',
      type: 'text',
      defaultValue: 'Your neighborhood shopping destination',
    },
    {
      name: 'address',
      type: 'textarea',
    },
    {
      name: 'phone',
      type: 'text',
    },
    {
      name: 'email',
      type: 'email',
    },
    {
      name: 'socialLinks',
      type: 'array',
      fields: [
        {
          name: 'platform',
          type: 'select',
          options: [
            { label: 'Facebook', value: 'facebook' },
            { label: 'Instagram', value: 'instagram' },
            { label: 'Twitter', value: 'twitter' },
            { label: 'LinkedIn', value: 'linkedin' },
            { label: 'YouTube', value: 'youtube' },
            { label: 'TikTok', value: 'tiktok' },
          ],
          required: true,
        },
        {
          name: 'url',
          type: 'text',
          required: true,
        },
      ],
    },
    {
      name: 'googleMapsEmbed',
      type: 'textarea',
      admin: {
        description: 'Paste the Google Maps embed iframe code here',
      },
    },
    {
      name: 'hours',
      type: 'textarea',
      admin: {
        description: 'General plaza hours',
      },
    },
    {
      name: 'leasingInfo',
      type: 'richText',
    },
    {
      name: 'leasingContactEmail',
      type: 'email',
    },
    {
      name: 'leasingContactPhone',
      type: 'text',
    },
  ],
}
