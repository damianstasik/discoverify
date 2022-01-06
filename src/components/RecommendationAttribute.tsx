import { mdiMenuDown } from '@mdi/js';
import Icon from '@mdi/react';
import { Grid, Input, Typography } from '@mui/material';
import Button from '@mui/material/Button';
import FormControlLabel from '@mui/material/FormControlLabel';
import Popover from '@mui/material/Popover';
import Slider from '@mui/material/Slider';
import Switch from '@mui/material/Switch';
import { useState } from 'react';
import { Attribute } from '../types';

interface Props<Value> {
  label: string;
  name: string;
  description: string;

  min?: number;
  max?: number;
  step?: number | null;
  marks?: Array<{ value: number; label: string }>;
  onSave?: (value: Attribute<Value>) => void;
}

export function RecommendationAttribute({ attr }: Props) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [minValue, setMin] = useState(attr.minValue);
  const [maxValue, setMax] = useState(attr.maxValue);
  const [target, setTarget] = useState(attr.targetValue);

  const [useMin, setUseMin] = useState(attr.minEnabled);
  const [useTarget, setUseTarget] = useState(attr.targetEnabled);
  const [useMax, setUseMax] = useState(attr.maxEnabled);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  return (
    <>
      <Button
        aria-describedby={attr.name}
        size="small"
        color="neutral"
        onClick={handleClick}
        endIcon={<Icon path={mdiMenuDown} size={1} />}
      >
        {attr.label}
      </Button>

      <Popover
        id={attr.name}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        PaperProps={{
          sx: {
            p: 2,
            width: 450,
          },
        }}
      >
        <Typography variant="h6" sx={{ mb: 1 }}>
          {attr.label}
        </Typography>

        <Typography color="text.secondary" sx={{ mb: 2 }}>
          {attr.description}
        </Typography>

        <Typography sx={{ mt: 2 }}>
          Minimum {attr.label.toLowerCase()}
        </Typography>

        <Grid container spacing={2} alignItems="center">
          <Grid item>
            <Switch
              edge="start"
              checked={useMin}
              onChange={(e) => setUseMin(e.target.checked)}
              name="useMin"
            />
          </Grid>

          <Grid item xs display="flex" sx={{ alignItems: 'center' }}>
            <Slider
              valueLabelDisplay="auto"
              min={attr.min ?? 0}
              max={attr.max ?? 1}
              step={typeof attr.step === 'undefined' ? 0.05 : attr.step}
              value={minValue}
              onChange={(e: any) => setMin(e.target.value)}
              aria-labelledby="useMin"
              disabled={!useMin}
              marks={attr.marks}
              // valueLabelFormat={valueLabelFormat}
            />
          </Grid>
        </Grid>

        <Typography sx={{ mt: 2 }}>
          Target {attr.label.toLowerCase()}
        </Typography>

        <Grid container spacing={2} alignItems="center">
          <Grid item>
            <Switch
              edge="start"
              checked={useTarget}
              onChange={(e) => setUseTarget(e.target.checked)}
              name="useTarget"
            />
          </Grid>
          <Grid item xs display="flex" sx={{ alignItems: 'center' }}>
            <Slider
              valueLabelDisplay="auto"
              min={attr.min ?? 0}
              max={attr.max ?? 1}
              step={typeof attr.step === 'undefined' ? 0.05 : attr.step}
              value={target}
              onChange={(e: any) => setTarget(e.target.value)}
              aria-labelledby="useTarget"
              disabled={!useTarget}
              marks={attr.marks}
              // valueLabelFormat={valueLabelFormat}
            />
          </Grid>
        </Grid>

        <Typography sx={{ mt: 2 }}>
          Maximum {attr.label.toLowerCase()}
        </Typography>

        <Grid container spacing={2} alignItems="center">
          <Grid item>
            <Switch
              edge="start"
              checked={useMax}
              onChange={(e) => setUseMax(e.target.checked)}
              name="useMax"
            />
          </Grid>
          <Grid item xs display="flex" sx={{ alignItems: 'center' }}>
            <Slider
              valueLabelDisplay="auto"
              min={attr.min ?? 0}
              max={attr.max ?? 1}
              step={typeof attr.step === 'undefined' ? 0.05 : attr.step}
              value={maxValue}
              onChange={(e: any) => setMax(e.target.value)}
              aria-labelledby="useMax"
              disabled={!useMax}
              marks={attr.marks}
              // valueLabelFormat={valueLabelFormat}
            />
          </Grid>
        </Grid>

        <Button
          variant="contained"
          onClick={() => {
            attr.onSave({
              min: useMin ? minValue : null,
              max: useMax ? maxValue : null,
              target: useTarget ? target : null,
            });

            handleClose();
          }}
          sx={{ mt: 2 }}
        >
          Save
        </Button>
      </Popover>
    </>
  );
}
