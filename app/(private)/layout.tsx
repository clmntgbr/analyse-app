import { MediaProvider } from "@/lib/media/provider"
import { ThemeProvider } from "@/lib/theme/theme-provider"
import { UserProvider } from "@/lib/user/provider"

export default function PrivateLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <UserProvider>
        <MediaProvider>
          <div className="mx-auto px-0">{children}</div>
        </MediaProvider>
      </UserProvider>
    </ThemeProvider>
  )
}
