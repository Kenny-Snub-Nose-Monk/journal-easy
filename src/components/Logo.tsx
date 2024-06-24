import Link from 'next/link'

export default function Logo() {
  return (
    <Link href="/" className="block w-30 overflow-hidden">
      <h1 className="font-bold text-xl bg-muted w-20">
        &nbsp;划水&nbsp;
        <span className="text-background bg-foreground">&nbsp;AI&nbsp;</span>
      </h1>
    </Link>
  )
}
