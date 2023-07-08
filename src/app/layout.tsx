import '@/styles/globals.scss'
import { Providers } from './redux/provider'

export const metadata = {
  title: 'Tasktide',
  description: 'The modern to-do list',
}

export default function RootLayout({children}: { children: React.ReactNode}) {
    return (
        <html lang="en">
            <body>
                <Providers>
                    {children}
                </Providers>
            </body>
        </html>
    )
}
