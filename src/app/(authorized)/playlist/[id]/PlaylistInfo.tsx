import { getPlaylist } from "../../../../api/getPlaylist";
import { BgImg } from "../../../../components/BgImg";

export async function PlaylistInfo({ id }) {
  const playlist = await getPlaylist(id);

  return (
    <>
      <BgImg
        src={playlist?.images?.[0]?.url}
        key={id}
        alt="Playlist cover picture"
      />

      <div className="p-3 border-b border-white/5 backdrop-blur-lg">
        <h2 className="text-xl/none text-white font-bold">{playlist.name}</h2>
      </div>
    </>
  );
}
