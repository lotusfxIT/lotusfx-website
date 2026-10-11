import { notFound } from 'next/navigation'
import { readAdminJson } from '@/lib/admin-json-store'

export const dynamic = 'force-dynamic'

export default async function DynamicPageLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: { slug: string }
}) {
  const pages = await readAdminJson<Record<string, unknown>>('public/pages-content.json', {})
  if (!pages || !Object.prototype.hasOwnProperty.call(pages, params.slug)) {
    notFound()
  }
  return children
}
