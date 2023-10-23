import { faker } from "@faker-js/faker";
import { chromium } from "playwright";

async function run() {
  const browser = await chromium.launch();

  const context = await browser.newContext({
    viewport: {
      width: 1440,
      height: 900,
    },
  });

  const page = await context.newPage();

  await page.route(
    "https://api.discoverify.app/trpc/auth.me*",
    async (route) => {
      const json = [
        {
          result: {
            data: {
              email: faker.internet.email(),
              displayName: faker.name.firstName(),
              spotifyId: faker.random.alphaNumeric(15),
              photoUrl: faker.image.abstract(100, 100),
              accessToken: faker.random.alphaNumeric(50),
            },
          },
        },
      ];

      await route.fulfill({ json });
    },
  );

  await page.route(
    "https://api.discoverify.app/trpc/user.playlists,track.recommended,track.tracksById*",
    async (route) => {
      const playlist = () => ({
        id: faker.random.alphaNumeric(15),
        name: faker.music.songName(),
      });

      const track = (id?: string) => ({
        id: id || faker.random.alphaNumeric(15),
        name: faker.music.songName(),
        album: {
          id: faker.random.alphaNumeric(15),
          name: faker.music.songName(),
          uri: faker.random.alphaNumeric(15),
          images: [
            {
              height: 100,
              url: faker.image.abstract(100, 100),
              width: 100,
            },
          ],
        },
        artist: [
          {
            id: faker.random.alphaNumeric(15),
            name: faker.name.fullName(),
            uri: faker.random.alphaNumeric(15),
          },
        ],
        artists: [
          {
            id: faker.random.alphaNumeric(15),
            name: faker.name.fullName(),
            uri: faker.random.alphaNumeric(15),
          },
        ],
        duration: faker.datatype.number({ min: 100000, max: 500000 }),
        uri: faker.random.alphaNumeric(15),
      });

      const json = [
        {
          result: {
            data: {
              playlists: [
                playlist(),
                playlist(),
                playlist(),
                playlist(),
                playlist(),
                playlist(),
                playlist(),
                playlist(),
                playlist(),
                playlist(),
              ],
            },
          },
        },
        {
          result: {
            data: [
              track(),
              track(),
              track(),
              track(),
              track(),
              track(),
              track(),
              track(),
              track(),
              track(),
              track(),
              track(),
              track(),
              track(),
              track(),
              track(),
              track(),
              track(),
              track(),
              track(),
            ],
          },
        },
        {
          result: {
            data: [track("test")],
          },
        },
      ];
      await route.fulfill({ json });
    },
  );

  await page.goto("https://go.discoverify.app/recommendations?trackId=test", {
    waitUntil: "networkidle",
  });

  await page.screenshot({ path: "screenshot.png" });

  await context.close();
  await browser.close();
}

run();
