import './globals.css'

export const metadata = {
  title: 'Webflow App',
  description: 'An app to extend the functionality of Webflow',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full">
      <body className="h-full">{children}</body>
    </html>
  )
}
