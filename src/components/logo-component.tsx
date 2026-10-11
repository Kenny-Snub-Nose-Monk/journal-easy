import { useTranslations } from 'next-intl'
import { cn } from '@/lib/utils'

export default function Logo(props: { size?: 'small' | 'large' }) {
  const { size = 'small' } = props
  const t = useTranslations('common')
  return (
    <a href="/" className="blog overflow-hidden" role="logo">
      <h1 className={cn('font-bold flex', size === 'large' ? 'text-2xl' : 'text-xl bg-muted')}>
        <span>&nbsp;{t('brandName')}&nbsp;</span>
        <span className="text-background bg-foreground">&nbsp;AI&nbsp;</span>
      </h1>
    </a>
  )
}
