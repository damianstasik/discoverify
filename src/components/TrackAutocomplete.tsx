import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import CircularProgress from '@mui/material/CircularProgress';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import { type HTMLAttributes } from 'react';
import { type Theme, type SxProps } from '@mui/material';

const menuItemStyle: SxProps<Theme> = {
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'flex-start',
};

const autocompleteStyle: SxProps<Theme> = {
  width: 300,
};

const renderOption = (option: HTMLAttributes<HTMLLIElement>, track: any) => {
  return (
    <MenuItem {...option} sx={menuItemStyle}>
      <Typography display="block">{track.title}</Typography>
      <Typography variant="caption" display="block">
        {track.artist.map((artist: any) => artist.name).join(' / ')}
      </Typography>
    </MenuItem>
  );
};

export function TrackAutocomplete({
  tracks,
  isDisabled,
  isLoading,
  query,
  onQueryChange,
  onTrackSelection,
}) {
  return (
    <Autocomplete
      id="track-autocomplete"
      sx={autocompleteStyle}
      renderOption={renderOption}
      getOptionLabel={(option) => option.title}
      options={tracks || []}
      disabled={isDisabled}
      loading={isLoading}
      onInputChange={(event, value) => onQueryChange(value)}
      onChange={(event, value) => onTrackSelection(value)}
      inputValue={query}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Search"
          variant="outlined"
          InputProps={{
            ...params.InputProps,
            endAdornment: isLoading ? (
              <CircularProgress color="inherit" size={20} />
            ) : null,
          }}
        />
      )}
    />
  );
}
