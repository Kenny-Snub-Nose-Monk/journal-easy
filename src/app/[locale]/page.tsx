import { useTranslations } from 'next-intl'
import { getTranslations } from 'next-intl/server'
import { User } from 'lucide-react'
import HomeNav from '@/components/home-nav'
import Slogan from '@/components/home-slogan'
import StartButton from '@/components/start-button'
import SignInButton from '@/components/sigin-in-button'
import { getUserInfo } from '@/lib/session'

// import { isUserInvited } from '@/app/invitation-code/action'

export default function Home() {
  const homeTrans = useTranslations('home')
  const commonTrans = useTranslations('common')

  return (
    <main className="flex flex-col justify-center text-center mb-20">
      <HomeNav />
      <section className="flex flex-col justify-center h-screen">
        <h2 className="scroll-m-20 text-4xl tracking-tight lg:text-5xl">
          <span className="font-extrabold">{commonTrans('brandName')} AI</span>
          ，{homeTrans('slogan')}
        </h2>
        <Slogan text={homeTrans('subTitle')} />
        <section className="mt-10 flex justify-center space-x-4">
          <MainButton />
        </section>
      </section>

      <section className="container flex flex-col gap-16 md:gap-36">
        {/* Demo Item 1 */}
        {[
          {
            title: homeTrans('ai-auto-generate-title'),
            description: homeTrans('ai-auto-generate'),
            src: 'https://storage.cloud.google.com/journal-easy-app/img/home/ai-auto-generate.mov?authuser=2',
          },
          {
            title: homeTrans('ai-replace-content-title'),
            description: homeTrans('ai-replace-content'),
            src: 'https://storage.cloud.google.com/journal-easy-app/img/home/ai-replace-content.mov?authuser=2',
          },
          {
            title: homeTrans('collaborate-title'),
            description: homeTrans('collaborate'),
            src: 'https://storage.cloud.google.com/journal-easy-app/img/home/collaborate.mov?authuser=2',
          },
        ].map((item) => (
          <DemoSection
            key={item.title}
            title={item.title}
            description={item.description}
            src={item.src}
          />
        ))}
      </section>
    </main>
  )
}

async function MainButton() {
  const user = await getUserInfo()
  const homeTrans = await getTranslations('home')

  if (user == null) {
    return (
      <SignInButton className="text-base" size="lg">
        <User className="h-4 w-4" />
        &nbsp;{homeTrans('login')} / {homeTrans('register')}
      </SignInButton>
    )
  }

  return <StartButton />
}

function DemoSection({
  title,
  description,
  src,
}: {
  title: string
  description: string
  src: string
}) {
  return (
    <div className="optimized-render-block flex flex-col gap-6 md:gap-14">
      <div className="flex flex-col text-center">
        <h2 className="scroll-m-20 text-4xl tracking-tight lg:text-5xl">
          <span className="font-extrabold">{title}</span>
        </h2>
        <p className="leading-7 [&:not(:first-child)]:mt-6 text-lg">
          <span>{description}</span>
        </p>
      </div>
      <div className="w-full overflow-hidden rounded-2xl bg-brand-gray-300 px-4 pt-4 md:rounded-3xl md:px-6 md:pt-6 lg:aspect-[1296/670] lg:p-0">
        <div
          className="relative mx-auto"
          style={{
            width: '1100px',
            height: '720px',
            maxWidth: '100%',
            maxHeight: '75vh',
            aspectRatio: '1100/720',
          }}
        >
          <video
            className="w-full h-full rounded-2xl"
            src={src}
            autoPlay
            muted
            loop
            playsInline
            controls={false}
            style={{ outline: 'none' }}
          />
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              boxShadow: 'inset 0 0 0 3px white',
              borderRadius: '1rem',
              width: '100%',
              height: '100%',
            }}
          ></div>
        </div>
      </div>
    </div>
  )
}
