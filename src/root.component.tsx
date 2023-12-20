import {
  // @ts-ignore
  AppProviders,
} from "@clearblade/ia-mfe-react";
import DashboardPlugin from "./components/DashboardPlugin";

export default function Root() {
  return (
    <AppProviders>
      <DashboardPlugin />
    </AppProviders>
  );
}
