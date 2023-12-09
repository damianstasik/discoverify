import { getAlbum } from "../../../../api/getAlbum";
import { BgImg } from "../../../../components/BgImg";

export async function AlbumInfo({ id }) {
  const album = await getAlbum(id);

  return (
    <>
      <BgImg src={album.images[0]?.url} key={id} alt="Album cover picture" />

      <div className="p-3 border-b border-white/5 backdrop-blur-lg">
        <h2 className="text-xl/none text-white font-bold">{album.name}</h2>
      </div>
    </>
  );
}
