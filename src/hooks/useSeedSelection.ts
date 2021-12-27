import { type GridRowParams, type GridRowId } from '@mui/x-data-grid-pro';
import { useCallback, useState } from 'react';

export function useSeedSelection() {
  const [selectedSeeds, setSelectedSeeds] = useState<Array<GridRowId>>([]);

  const isSeedSelectable = useCallback(
    (params: GridRowParams) =>
      selectedSeeds.includes(params.id) ? true : selectedSeeds.length < 5,
    [selectedSeeds],
  );

  return {
    selectedSeeds,
    setSelectedSeeds,
    isSeedSelectable,
  };
}
