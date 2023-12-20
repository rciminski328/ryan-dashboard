import { getBasePath } from "@clearblade/ia-mfe-core";
import {
  appQueryClient,
  // @ts-ignore
  IntlProvider,
  // @ts-ignore
  MuiPickersUtilsProvider,
  // @ts-ignore
  DateFnsUtils,
  // @ts-ignore
  useDateFnsLocale,
  // @ts-ignore
  RecoilRoot,
} from "@clearblade/ia-mfe-react";
import { QueryClientProvider } from "react-query";
import { BrowserRouter } from "react-router-dom";
import DashboardPlugin from "./components/DashboardPlugin";

export default function Root() {
  return (
    <BrowserRouter basename={getBasePath()}>
      <QueryClientProvider contextSharing client={appQueryClient}>
        <RecoilRoot>
          <IntlProvider locale="en">
            <MuiPickersUtilsProviderWrapper>
              <DashboardPlugin />
            </MuiPickersUtilsProviderWrapper>
          </IntlProvider>
        </RecoilRoot>
      </QueryClientProvider>
    </BrowserRouter>
  );
}

function MuiPickersUtilsProviderWrapper({ children }: { children: unknown }) {
  const locale = useDateFnsLocale();
  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils} locale={locale}>
      {children}
    </MuiPickersUtilsProvider>
  );
}
