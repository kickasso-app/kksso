'use client';

import { Grommet } from "grommet";
import { Analytics } from "@vercel/analytics/react";
import grommetTheme from "styles/grommetTheme";

import { CityProvider } from "services/city";
import { AuthProvider } from "services/auth";
import { AccountProvider } from "services/account";
import { StudiosProvider } from "services/studios";
import { RequestsProvider } from "services/requests";
import { EventsProvider } from "services/events";

export function Providers({ children }) {
  return (
    <Grommet theme={grommetTheme}>
      <CityProvider>
        <AuthProvider>
          <AccountProvider>
            <RequestsProvider>
              <EventsProvider>
                <StudiosProvider>
                    {children}
                </StudiosProvider>
              </EventsProvider>
            </RequestsProvider>
          </AccountProvider>
        </AuthProvider>
      </CityProvider>
      <Analytics />
    </Grommet>
  );
}