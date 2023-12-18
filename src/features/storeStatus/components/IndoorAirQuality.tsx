import { Card, Grid } from '@material-ui/core';
import GaugeChart from './GaugeChart';
import { useStoreStatusQuery } from '../api/storeStatus';

export default function IndoorAirQuality({ assetId }: { assetId: string }) {
  const { data } = useStoreStatusQuery({ assetId });
  console.log('data', data);
  return (
    <Card>
      <Grid container alignItems='center' justifyContent='center' spacing={2}>
        <Grid item>
          <GaugeChart
            title='Temperature'
            units='F'
            value={data.custom_data.temperature}
          />
        </Grid>
        <Grid item>
          <GaugeChart
            title='Humidity'
            units='%'
            value={data.custom_data.humidity}
          />
        </Grid>
        <Grid item>
          <GaugeChart title='CO2' units='PPM' value={data.custom_data.co2} />
        </Grid>
      </Grid>
    </Card>
  );
}
