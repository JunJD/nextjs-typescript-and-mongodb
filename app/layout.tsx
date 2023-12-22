import './globals.css'
import { FetchConfig } from 'http-react'
import { GeistSans } from 'geist/font/sans'
import type { Metadata } from 'next'
import Navbar from 'components/Navbar'
import { ThemeProvider } from 'components/theme-provider'
import { AtomicState } from 'atomic-state'

export const metadata: Metadata = {
  title: 'Home',
  description: 'Home page '
}

function MainLayout({ children }) {
  return (
    <html suppressHydrationWarning>
      <head>
        <title>Next.js starter</title>
        <meta name='description' content='A Starter with Next.js' />
      </head>

      <body className={GeistSans.className}>
        <ThemeProvider attribute='class' defaultTheme='system'>
          <main className='min-h-screen'>
            <AtomicState>
              <FetchConfig baseUrl='/api'>
                <Navbar />
                <div className='max-w-7xl mx-auto p-4'>{children}</div>
              </FetchConfig>
            </AtomicState>
          </main>
        </ThemeProvider>
      </body>
    </html>
  )
}

export default MainLayout
