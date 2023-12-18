import { getBasePath } from '@clearblade/ia-mfe-core';
import { appQueryClient } from '@clearblade/ia-mfe-react';
import { QueryClientProvider } from 'react-query';
import { BrowserRouter } from 'react-router-dom';
import DashboardPlugin from './components/DashboardPlugin';

export default function Root(props) {
  return (
    <BrowserRouter basename={getBasePath()}>
      <QueryClientProvider contextSharing client={appQueryClient}>
        <DashboardPlugin />
      </QueryClientProvider>
    </BrowserRouter>
  );
}
