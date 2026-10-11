import { Users, User, Sparkles, MessageSquare, Zap, FolderOpen, Edit3, Wand2, Bot, Lightbulb, Pen } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import ChangeTheme from '@/components/change-theme'
import ChangeLocale from '@/components/change-locale'
import Logo from '@/components/logo-component'
import HomeFeaturesButton from '@/components/home-features-button'
import SignInButton from '@/components/sign-in-button'
import StartButton from '@/components/start-button'
import HomeTabs from '@/components/home-tabs'
import Footer from '@/components/footer'
import { getUserInfo } from '@/lib/session'
import { getTranslations } from 'next-intl/server'

export default async function HomePage() {
  const t = await getTranslations('home')

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white dark:from-gray-900 dark:to-gray-800">
      {/* Navigation */}
      <nav className="border-b border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Logo size="large" />
            <div className="flex items-center space-x-2">
              <HomeFeaturesButton />
              <ChangeLocale />
              <ChangeTheme />
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 border-b border-b-secondary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Badge variant="secondary" className="mb-4 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
              <Sparkles className="w-4 h-4 mr-2 text-purple-600" />
              AI-Powered Workspace
            </Badge>
            <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6">
              {t('sloganPart1')}
              <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                {' '}
                {t('sloganPart2')}
              </span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">{t('subTitle')}</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <MainButton
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                size="lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">{t('title2')}</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">{t('desc2')}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Document Management */}
            <Card className="border border-secondary shadow-lg dark:shadow-gray-900/25 hover:shadow-xl dark:hover:shadow-gray-900/40 transition-shadow bg-white dark:bg-gray-800">
              <CardHeader>
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mb-4">
                  <FolderOpen className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <CardTitle className="text-gray-900 dark:text-white">{t('documentManagement')}</CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-300">
                  {t('documentManagementDesc')}
                </CardDescription>
              </CardHeader>
            </Card>

            {/* Rich Text Editor */}
            <Card className="border border-secondary shadow-lg dark:shadow-gray-900/25 hover:shadow-xl dark:hover:shadow-gray-900/40 transition-shadow bg-white dark:bg-gray-800">
              <CardHeader>
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center mb-4">
                  <Edit3 className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
                <CardTitle className="text-gray-900 dark:text-white">{t('richTextEditor')}</CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-300">
                  {t('richTextEditorDesc')}
                </CardDescription>
              </CardHeader>
            </Card>

            {/* Collaboration */}
            <Card className="border border-secondary shadow-lg dark:shadow-gray-900/25 hover:shadow-xl dark:hover:shadow-gray-900/40 transition-shadow bg-white dark:bg-gray-800">
              <CardHeader>
                <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                </div>
                <CardTitle className="text-gray-900 dark:text-white">{t('collab')}</CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-300">{t('collabDesc')}</CardDescription>
              </CardHeader>
            </Card>

            {/* AI Writing */}
            <Card className="border border-secondary shadow-lg dark:shadow-gray-900/25 hover:shadow-xl dark:hover:shadow-gray-900/40 transition-shadow bg-white dark:bg-gray-800">
              <CardHeader>
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
                <CardTitle className="text-gray-900 dark:text-white">{t('AIGenText')}</CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-300">{t('AIGenTextDesc')}</CardDescription>
              </CardHeader>
            </Card>

            {/* AI Optimization */}
            <Card className="border border-secondary shadow-lg dark:shadow-gray-900/25 hover:shadow-xl dark:hover:shadow-gray-900/40 transition-shadow bg-white dark:bg-gray-800">
              <CardHeader>
                <div className="w-12 h-12 bg-pink-100 dark:bg-pink-900/30 rounded-lg flex items-center justify-center mb-4">
                  <Wand2 className="w-6 h-6 text-pink-600 dark:text-pink-400" />
                </div>
                <CardTitle className="text-gray-900 dark:text-white">{t('AIProcessText')}</CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-300">{t('AIProcessTextDesc')}</CardDescription>
              </CardHeader>
            </Card>

            {/* AI Chat */}
            <Card className="border border-secondary shadow-lg dark:shadow-gray-900/25 hover:shadow-xl dark:hover:shadow-gray-900/40 transition-shadow bg-white dark:bg-gray-800">
              <CardHeader>
                <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg flex items-center justify-center mb-4">
                  <Bot className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                </div>
                <CardTitle className="text-gray-900 dark:text-white">{t('AIChat')}</CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-300">{t('AIChatDesc')}</CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Feature GIF Showcase */}
      <section
        id="features-showcase"
        className="py-24 bg-gradient-to-br from-slate-50 to-white dark:from-gray-800 dark:to-gray-900 border-t border-t-secondary"
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">{t('title3')}</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">{t('desc3')}</p>
          </div>
          <HomeTabs />
        </div>
      </section>

      {/* Feature Showcase */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 border-t border-t-secondary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <Badge variant="secondary" className="mb-4 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
                <Zap className="w-4 h-4 mr-2" />
                Powered by AI
              </Badge>
              <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">{t('title4')}</h3>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center flex-shrink-0">
                    <Lightbulb className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">{t('inspiration')}</h4>
                    <p className="text-gray-600 dark:text-gray-300">{t('inspirationDesc')}</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center flex-shrink-0">
                    <Pen className="w-4 h-4 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">{t('optimization')}</h4>
                    <p className="text-gray-600 dark:text-gray-300">{t('optimizationDesc')}</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center flex-shrink-0">
                    <MessageSquare className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">{t('askQuestion')}</h4>
                    <p className="text-gray-600 dark:text-gray-300">{t('askQuestionDesc')}</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl dark:shadow-gray-900/25 p-8 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                </div>
                <div className="space-y-4">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
                  <div className="bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 rounded-lg p-4 border border-purple-200 dark:border-purple-700">
                    <div className="flex items-center space-x-2 mb-2">
                      <Sparkles className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                      <span className="text-sm font-medium text-purple-800 dark:text-purple-300">AI Suggestion</span>
                    </div>
                    <div className="h-3 bg-purple-200 dark:bg-purple-700 rounded w-4/5"></div>
                  </div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-purple-600 to-pink-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">{t('title5')}</h2>
          <p className="text-xl text-purple-100 mb-8">{t('desc5')}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <MainButton size="lg" className="bg-white text-purple-600 hover:bg-gray-50" />
          </div>
        </div>
      </section>

      {/* Footer */}
      {/* <footer className="bg-gray-900 dark:bg-black text-muted-foreground py-16">
        <p className="text-center">&copy; 2024 DocSpace. All rights reserved.</p>
      </footer> */}
      <Footer className="bg-gray-900 dark:bg-black border-t-0" />
    </div>
  )
}

async function MainButton(props: { className?: string; size?: 'sm' | 'lg' | 'default' | 'icon' | null }) {
  const user = await getUserInfo()
  const { className, size } = props
  const homeTrans = await getTranslations('home')

  if (user == null) {
    return (
      <SignInButton className={className} size={size}>
        <User className="h-4 w-4" />
        &nbsp;{homeTrans('login')} / {homeTrans('register')}
      </SignInButton>
    )
  }

  return <StartButton className={className} size={size} />
}
