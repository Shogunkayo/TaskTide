import '@/styles/globals.scss'

export const metadata = {
  title: 'Tasktide',
  description: 'The modern to-do list',
}

export default function RootLayout({children}: { children: React.ReactNode}) {
    return (
        <html lang="en">
            <body>{children}</body>
        </html>
    )
}
