// 'use client';

import castArray from "lodash/castArray";
import { Suspense, useMemo } from "react";
import { ArtistChipSkeleton } from "../../../components/ArtistChipSkeleton";
import { TrackChipSkeleton } from "../../../components/TrackChipSkeleton";
import { getAttributeValuesFromQueryParams } from "../../../utils/getAttributeValuesFromQueryParams";
import { ArtistSeeds } from "./ArtistSeeds";
import { Attributes } from "./Attributes";
import { SeedAutocomplete } from "./SeedAutocomplete";
import { Table } from "./Table";
import { TrackSeeds } from "./TrackSeeds";

export default function Recommendations({ searchParams }) {
  const attributeValues = getAttributeValuesFromQueryParams(searchParams);

  const trackIds = castArray(searchParams.trackId || []);
  const artistIds = castArray(searchParams.artistId || []);
  const genreIds = castArray(searchParams.genre || []);

  const seeds = useMemo(
    () => [
      ...trackIds.map((id) => ({ type: "track", id })),
      ...artistIds.map((id) => ({ type: "artist", id })),
      ...genreIds.map((id) => ({ type: "genre", id })),
    ],
    [trackIds, artistIds, genreIds],
  );

  return (
    <>
      <div className="p-3 bg-slate-850 border-b border-slate-700">
        <SeedAutocomplete />

        <div className="flex mt-3">
          <div className="w-1/2">
            <h5 className="uppercase text-slate-400 text-xs font-semibold pb-3 tracking-wide">
              Attributes
            </h5>
            <div className="flex flex-wrap gap-2">
              <Attributes values={attributeValues} />
            </div>
          </div>
          <div className="w-1/2">
            {seeds.length > 0 && (
              <div>
                <h5 className="uppercase text-slate-400 text-xs font-semibold pb-3 tracking-wide">
                  Selected seeds
                </h5>
                <div className="flex flex-wrap gap-2">
                  {trackIds.length > 0 && (
                    <Suspense
                      fallback={trackIds.map((id) => (
                        <TrackChipSkeleton key={id} />
                      ))}
                    >
                      <TrackSeeds ids={trackIds} />
                    </Suspense>
                  )}
                  {artistIds.length > 0 && (
                    <Suspense
                      fallback={artistIds.map((id) => (
                        <ArtistChipSkeleton key={id} />
                      ))}
                    >
                      <ArtistSeeds ids={artistIds} />
                    </Suspense>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {seeds.length > 0 && (
        <Table
          attributeValues={attributeValues}
          trackIds={trackIds}
          artistIds={artistIds}
        />
      )}
    </>
  );
}
