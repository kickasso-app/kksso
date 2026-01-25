'use client';

import { CityProvider } from "services/city";
import { AuthProvider } from "services/auth";
import { AccountProvider } from "services/account";
import { StudiosProvider } from "services/studios";
import { RequestsProvider } from "services/requests";
import { EventsProvider } from "services/events";
import Layout from "layouts/Layout";

export function Providers({ children }) {
  return (
    <CityProvider>
      <AuthProvider>
        <AccountProvider>
          <RequestsProvider>
            <EventsProvider>
              <StudiosProvider>
                <Layout>
                  {children}
                </Layout>
              </StudiosProvider>
            </EventsProvider>
          </RequestsProvider>
        </AccountProvider>
      </AuthProvider>
    </CityProvider>
  );
}
