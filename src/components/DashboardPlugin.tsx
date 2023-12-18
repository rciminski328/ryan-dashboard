import { useState } from 'react';
import { makeStyles } from '@material-ui/core';
import { useStoreStatusQuery } from '../features/storeStatus/api/storeStatus';
import { useDoorOpenHistoryQuery } from '../features/refrigeratorStatus/api/doorOpenHistory';
import { useHumidityHistoryQuery } from '../features/refrigeratorStatus/api/humidityHistory';
import { useRefrigeratorStatusQuery } from '../features/refrigeratorStatus/api/refrigeratorStatus';
import { useTemperatureHistoryQuery } from '../features/refrigeratorStatus/api/temperatureHistory';
import { Skeleton } from '@material-ui/lab';
import RefrigeratorStatus from '../features/refrigeratorStatus/components/RefrigeratorStatus';

const usePluginStyles = makeStyles((theme) => ({
  plugin: {
    marginTop: theme.spacing(1),
    width: '100%',
  },
}));

export default function DashboardPlugin() {
  const refrigeratorAssetId = '628aef25-734f-4075-8d0d-2150ed842406';
  const storeAssetId = 'f47fa820-6005-410b-88b3-652f7c8bc7eb';
  const indoorEnvironmentStatusQuery = useStoreStatusQuery({
    assetId: storeAssetId,
  });
  const refrigeratorStatusQuery = useRefrigeratorStatusQuery({
    assetId: refrigeratorAssetId,
  });
  const temperatureHistoryQuery = useTemperatureHistoryQuery({
    assetId: refrigeratorAssetId,
  });
  const humidityHistoryQuery = useHumidityHistoryQuery({
    assetId: refrigeratorAssetId,
  });
  const doorOpenHistoryQuery = useDoorOpenHistoryQuery({
    assetId: refrigeratorAssetId,
  });
  const classes = usePluginStyles();
  if (
    indoorEnvironmentStatusQuery.isLoading ||
    refrigeratorStatusQuery.isLoading ||
    temperatureHistoryQuery.isLoading ||
    humidityHistoryQuery.isLoading ||
    doorOpenHistoryQuery.isLoading
  )
    return <Skeleton />;
  if (
    indoorEnvironmentStatusQuery.isError ||
    refrigeratorStatusQuery.isError ||
    temperatureHistoryQuery.isError ||
    humidityHistoryQuery.isError ||
    doorOpenHistoryQuery.isError
  )
    return <div>Error</div>;

  return (
    <div className={classes.plugin}>
      <RefrigeratorStatus assetId='placeholder' />
    </div>
  );
}
