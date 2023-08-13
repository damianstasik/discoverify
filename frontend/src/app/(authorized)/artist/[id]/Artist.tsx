import { getArtist } from "../../../../api/artist";
import { BgImg } from "../../../../components/BgImg";

export async function Artist({ id }) {
  const artist = await getArtist(id);
  return (
    <div>
      <BgImg src={artist?.images?.[0].url} key={id} alt="Artist's picture" />
      <div className="relative">
        <div className="border-b border-white/5 backdrop-blur-lg">
          <h2 className="p-3 text-xl/none text-white font-bold">
            {artist?.name || (
              <div className="animate-pulse h-em w-48 bg-slate-600 rounded-md" />
            )}
          </h2>
        </div>
      </div>
    </div>
  );
}
