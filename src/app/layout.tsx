import './globals.css'
import { Inter } from 'next/font/google'
import StyledComponentsRegistry from "./registry";
import { Providers } from "../redux/provider"

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Build new home',
  description: 'Generated by create next app',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <StyledComponentsRegistry>
          <Providers>{children}</Providers>
        </StyledComponentsRegistry>
      </body>
    </html>
  )
}
