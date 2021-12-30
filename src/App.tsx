import { LicenseInfo } from '@mui/x-data-grid-pro';
import { Router } from './Router';

const muiLicenseKey = import.meta.env.VITE_MUI_LICENSE_KEY;

if (muiLicenseKey) {
  LicenseInfo.setLicenseKey(muiLicenseKey);
}

export function App() {
  return <Router />;
}
