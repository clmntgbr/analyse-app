import { AnalysisProvider } from "@/lib/analysis/provider"
import { AnalysisCentrifugeListener } from "@/lib/centrifugo/analysis-centrifuge-listener"
import { PlanProvider } from "@/lib/plan/provider"
import { StatisticsProvider } from "@/lib/statistics/provider"
import { UserProvider } from "@/lib/user/provider"

export default function PrivateLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <PlanProvider>
      <UserProvider>
        <AnalysisProvider>
          <StatisticsProvider>
            <AnalysisCentrifugeListener />
            <div className="mx-auto bg-background px-0">{children}</div>
          </StatisticsProvider>
        </AnalysisProvider>
      </UserProvider>
    </PlanProvider>
  )
}
