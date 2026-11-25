import { Navigate, Route, Routes, useNavigate } from 'react-router-dom'
import type { LinkManager } from '../features/links/hooks/useLinkManager'

import { ConfirmationPage } from '../pages/Confirmation/ConfirmationPage'
import { ConfirmedPage } from '../pages/Confirmed/ConfirmedPage'
import { HomePage } from '../pages/Home/HomePage'
import { ProductivityPage } from '../pages/Productivity/ProductivityPage'
import { SettingsPage } from '../pages/Settings/settings'
import { Appearance } from '../pages/Settings/settingsRoutes/Appearance'
import { TimerPage } from '../pages/Timer/TimerPage'
import { DailyOverview } from '../pages/Productivity/dashboardRoutes/DailyOverview'
import { MyStudyHabits } from '../pages/Productivity/dashboardRoutes/MyStudyHabits'
import { WeeklyOverview } from '../pages/Productivity/dashboardRoutes/WeeklyOverview'


import { AppLayout } from './layout/AppLayout'
import { PATHS } from './navigation/paths'

interface AppRoutesProps {
  /** Session setup shared between pages. */
  timerDigits: string
  onTimerKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void
  linkManager: LinkManager
}

/** The app's route table: maps each path to its page and wires the page's navigation callbacks. */
export function AppRoutes({ timerDigits, onTimerKeyDown, linkManager }: AppRoutesProps) {
  const navigate = useNavigate()

  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route
          path={PATHS.home}
          element={
            <HomePage
              onStartSession={() => navigate(PATHS.confirmation)}
              onOpenProductivity={() => navigate(PATHS.productivity)}
            />
          }
        />
        <Route
          path={PATHS.confirmation}
          element={
            <ConfirmationPage
              timerDigits={timerDigits}
              onTimerKeyDown={onTimerKeyDown}
              linkManager={linkManager}
              onConfirmed={() => navigate(PATHS.confirmed)}
            />
          }
        />
        <Route
          path={PATHS.confirmed}
          element={
            <ConfirmedPage
              timerDigits={timerDigits}
              links={linkManager.links}
              onGoBack={() => navigate(PATHS.confirmation)}
              onStart={() => navigate(PATHS.timer)}
            />
          }
        />
        <Route
          path={PATHS.timer}
          element={<TimerPage timerDigits={timerDigits} onExit={() => navigate(PATHS.home)} />}
        />
        <Route path={PATHS.settings} element={<SettingsPage />}>
          <Route index element={<div className="productivity-page__view" />} />
          <Route path={PATHS.settingsAppearance} element={<Appearance />} />
        </Route>
        <Route path={PATHS.productivity} element={<ProductivityPage />}>
          <Route index element={<Navigate to={PATHS.productivityWeekly} replace />} />
          <Route path={PATHS.productivityWeekly} element={<WeeklyOverview />} />
          <Route path={PATHS.productivityDaily} element={<DailyOverview />} />
          <Route path={PATHS.productivityHabits} element={<MyStudyHabits />} />
        </Route>
        <Route path="*" element={<Navigate to={PATHS.home} replace />} />
      </Route>
    </Routes>
  )
}
