import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import CircularProgress from '@mui/material/CircularProgress';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import { type HTMLAttributes } from 'react';
import { type Theme, type SxProps, ListSubheader, Avatar } from '@mui/material';
import { Box } from '@mui/system';

const menuItemStyle: SxProps<Theme> = {
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'flex-start',
  alignItems: 'flex-start !important',
  // border: '1px solid red',
};

const autocompleteStyle: SxProps<Theme> = {
  width: 300,
};

const renderOption = (option: HTMLAttributes<HTMLLIElement>, track: any) => {
  console.log('t', track);
  switch (track.type) {
    case 'track':
      return (
        <MenuItem {...option} sx={menuItemStyle}>
          <Typography display="block">{track.name}</Typography>
          <Typography variant="caption" display="block">
            {track.artists.map((artist: any) => artist.name).join(', ')}
          </Typography>
        </MenuItem>
      );
    case 'genre':
      return (
        <MenuItem {...option} sx={menuItemStyle}>
          <Typography display="block">{track.label}</Typography>
        </MenuItem>
      );
    case 'artist':
      return (
        <MenuItem {...option}>
          <Avatar src={track.img} sx={{ mr: 1.5 }} />
          <Typography display="block">{track.label}</Typography>
        </MenuItem>
      );
  }
};

const groups = {
  genre: 'Genres',
  track: 'Tracks',
  artist: 'Artists',
};

export function EntityAutocomplete({
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
      getOptionLabel={(option) => option.label}
      options={tracks || []}
      disabled={isDisabled}
      groupBy={(item) => item.type}
      renderGroup={(params) => (
        <li key={params.key}>
          <ListSubheader sx={{ top: -8 }}>{groups[params.group]}</ListSubheader>
          <Box sx={{ padding: 0 }} component="ul">
            {params.children}
          </Box>
        </li>
      )}
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
