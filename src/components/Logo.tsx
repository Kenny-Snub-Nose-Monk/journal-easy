import Link from 'next/link'

export default function Logo() {
  return (
    <Link href="/" className="block w-30 overflow-hidden" tabIndex={-1}>
      <h1 className="font-bold text-xl">
        &nbsp;Journal&nbsp;
        <span className="text-background bg-foreground">&nbsp;Easy&nbsp;</span>
      </h1>
    </Link>
  )
}
