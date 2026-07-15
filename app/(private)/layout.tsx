import { MediaCentrifugeListener } from "@/lib/centrifugo/media-centrifuge-listener"
import { MediaProvider } from "@/lib/media/provider"
import { StatisticsProvider } from "@/lib/statistics/provider"
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
          <StatisticsProvider>
            <MediaCentrifugeListener />
            <div className="mx-auto bg-background px-0">{children}</div>
          </StatisticsProvider>
        </MediaProvider>
      </UserProvider>
    </ThemeProvider>
  )
}
