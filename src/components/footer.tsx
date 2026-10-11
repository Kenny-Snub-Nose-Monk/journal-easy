import { cn } from '@/lib/utils'
import { getTranslations } from 'next-intl/server'

export default async function Footer(props: { className?: string }) {
  const { className } = props
  const t = await getTranslations('common')
  const year = new Date().getFullYear()
  return (
    <footer className={cn('sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t', className)}>
      <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
        ©{year} {t('brandName')}. All rights reserved.
      </p>
    </footer>
  )
}
