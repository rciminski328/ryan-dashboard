import {
  // @ts-ignore
  ExposedAppProviders,
} from '@clearblade/ia-mfe-react';
import DashboardPlugin from './components/DashboardPlugin';

export default function Root() {
  return (
    <ExposedAppProviders>
      <DashboardPlugin />
    </ExposedAppProviders>
  );
}
