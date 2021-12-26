import Button from '@mui/material/Button';
import Slider from '@mui/material/Slider';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import FormGroup from '@mui/material/FormGroup';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import Grid from '@mui/material/Grid';
import { useState } from 'react';

interface Attributes {
  shouldSetMinAcousticness: boolean;
  shouldSetMaxAcousticness: boolean;
  shouldSetTargetAcousticness: boolean;
  minAcousticness: number;
  maxAcousticness: number;
  targetAcousticness: number;
}

interface Props {
  attributes: Pick<
    Attributes,
    'minAcousticness' | 'maxAcousticness' | 'targetAcousticness'
  >;
  onGenerate: (attributes: Attributes) => void;
}

export function RecommendationAttributes({ attributes, onGenerate }: Props) {
  const [shouldSetMinAcousticness, setShouldSetMinAcousticness] =
    useState(false);
  const [shouldSetMaxAcousticness, setShouldSetMaxAcousticness] =
    useState(false);
  const [shouldSetTargetAcousticness, setShouldSetTargetAcousticness] =
    useState(false);

  const [minAcousticness, setMinAcousticness] = useState(0);
  const [maxAcousticness, setMaxAcousticness] = useState(1);
  const [targetAcousticness, setTargetAcousticness] = useState(0.5);

  return (
    <>
      <Grid container spacing={2}>
        <Grid item xs={4}>
          <FormControl component="fieldset">
            <FormLabel component="legend">Acousticness</FormLabel>
            <FormGroup>
              <FormControlLabel
                control={
                  <Switch
                    checked={shouldSetMinAcousticness}
                    onChange={(e) =>
                      setShouldSetMinAcousticness(e.target.checked)
                    }
                    name="shouldSetMinAcousticness"
                  />
                }
                label="Should set min acousticness?"
              />
              <Slider
                value={minAcousticness}
                max={1}
                step={0.05}
                disabled={!shouldSetMinAcousticness}
                onChange={(a: any) => setMinAcousticness(a.target.value)}
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={shouldSetMaxAcousticness}
                    onChange={(e) =>
                      setShouldSetMaxAcousticness(e.target.checked)
                    }
                    name="shouldSetMaxAcousticness"
                  />
                }
                label="Should set max acousticness?"
              />
              <Slider
                value={maxAcousticness}
                max={1}
                step={0.05}
                disabled={!shouldSetMaxAcousticness}
                onChange={(a: any) => setMaxAcousticness(a.target.value)}
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={shouldSetTargetAcousticness}
                    onChange={(e) =>
                      setShouldSetTargetAcousticness(e.target.checked)
                    }
                    name="shouldSetTargetAcousticness"
                  />
                }
                label="Should set target acousticness?"
              />
              <Slider
                value={targetAcousticness}
                max={1}
                step={0.05}
                disabled={!shouldSetTargetAcousticness}
                onChange={(a: any) => setTargetAcousticness(a.target.value)}
              />
            </FormGroup>
          </FormControl>
        </Grid>
      </Grid>

      <Button
        onClick={() =>
          onGenerate({
            shouldSetMinAcousticness,
            shouldSetMaxAcousticness,
            shouldSetTargetAcousticness,
            minAcousticness,
            maxAcousticness,
            targetAcousticness,
          })
        }
      >
        Generate
      </Button>
    </>
  );
}
