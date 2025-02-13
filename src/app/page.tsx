// import Image from "next/image";
import { Button } from '@/components/ui/button'
import { Code, Zap } from 'lucide-react'
import HomeNav from '@/components/home-nav'
import Slogan from '@/components/Slogan'
import { StartButton, LearnButton } from '@/components/start-button'
import QRCode from '@/components/QRCode'

export default async function Home() {
  return (
    <main className="min-h-screen flex flex-col justify-center text-center">
      <HomeNav />
      <div className="flex flex-col justify-center text-start md:text-center mx-6">
        <section className="md:flex md:justify-center">
          <h2 className="text-4xl lg:text-5xl font-extrabold">划水 AI ，</h2>
          <h2 className="text-4xl lg:text-5xl mt-2 md:mt-0">
            智能寫作，高效工作
          </h2>
        </section>
        <Slogan />
        <section className="mt-12 flex justify-center space-x-4">
          <StartButton />
          <LearnButton />
        </section>
      </div>
      <div className="w-32 md:w-48 fixed bottom-2 right-2">
        <QRCode />
      </div>
    </main>
  )
}
