import { AppProviders } from "@clearblade/ia-mfe-react";
import { Main } from "./features/main";

export default function Root() {
  return (
    <AppProviders>
      <Main />
    </AppProviders>
  );
}
