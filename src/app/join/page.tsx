import HomeNav from '@/components/home-nav'
import { getHourStamp } from '@/lib/dt'
export default async function Join() {
  return (
    <main className="min-h-screen flex flex-col justify-center text-center">
      <HomeNav />
      <p>學習/參與開發，加群並諮詢作者（群主）雙越老師</p>
      <div className="mx-auto my-4">
        {/* eslint-disable-next-line */}
        <img
          src={`https://file-dev.huashuiai.com/static-home/qr.JPG?r=${getHourStamp()}`}
          alt="划水群二维码"
        />
      </div>
      <p className="text-sm italic text-muted-foreground">
        如加群失敗，可加 vx: <code>fe-wfp</code>，備註：劃水群
      </p>
    </main>
  )
}
