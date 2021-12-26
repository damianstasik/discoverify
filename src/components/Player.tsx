import { memo } from 'react';
import AudioPlayer from 'react-h5-audio-player';
import { useAtom } from 'jotai';
import { useAtomValue } from 'jotai/utils';
import { useQuery } from 'react-query';
import {
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  InputLabel,
  MenuItem,
  Select,
  Switch,
} from '@mui/material';
import {
  deviceIdState,
  playTrackPreviewsState,
  tokenIdState,
  trackPreviewState,
} from '../store';

export const Player = memo(() => {
  const [trackPreview, setTrackPreview] = useAtom(trackPreviewState);

  const [playTrackPreviews, setPlayTrackPreviews] = useAtom(
    playTrackPreviewsState,
  );
  const [deviceId, setDeviceId] = useAtom(deviceIdState);
  const tokenId = useAtomValue(tokenIdState);

  // const { data: player } = useQuery(
  //   ['player', tokenId],
  //   async () => {
  //     const res = await fetch(
  //       `/player?tokenId=${tokenId}`,
  //     );
  //     const body = await res.json();
  //     return body;
  //   },
  //   {
  //     refetchInterval: 5000,
  //     enabled: !playTrackPreviews,
  //   },
  // );

  // const { data = [], isLoading } = useQuery(['devices', tokenId], async () => {
  //   const res = await fetch(`/devices?tokenId=${tokenId}`);
  //   const body = await res.json();
  //   return body;
  // });

  return (
    <AudioPlayer
      customAdditionalControls={
        [
          // <FormControlLabel
          //   control={
          //     <Switch
          //       checked={playTrackPreviews}
          //       onChange={(e) => setPlayTrackPreviews(e.target.checked)}
          //     />
          //   }
          //   label="Play track previews"
          //   style={{ color: '#333' }}
          // />,
          // <FormControl
          //   size="small"
          //   style={{ minWidth: 100 }}
          //   disabled={isLoading || playTrackPreviews}
          // >
          //   <InputLabel id="device">Device</InputLabel>
          //   <Select
          //     autoWidth
          //     labelId="device"
          //     id="device"
          //     label="Device"
          //     value={deviceId}
          //     onChange={(e) => setDeviceId(e.target.value)}
          //   >
          //     {data.map((device) => (
          //       <MenuItem key={device.id} value={device.id}>
          //         {device.name}
          //       </MenuItem>
          //     ))}
          //   </Select>
          // </FormControl>,
        ]
      }
      src={trackPreview?.url}
      onEnded={() => setTrackPreview(null)}
    />
  );
});
