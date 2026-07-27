import assert from "node:assert/strict";
import test from "node:test";

import { GET } from "app/api/spotify/playlist/route";

test("Spotify 장애를 제한적으로 재시도하고 안전하게 응답한다", async (t) => {
  const originalEnv = {
    clientId: process.env.SPOTIFY_CLIENT_ID,
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
    refreshToken: process.env.SPOTIFY_REFRESH_TOKEN,
  };
  const loggedErrors: unknown[][] = [];

  process.env.SPOTIFY_CLIENT_ID = "test";
  process.env.SPOTIFY_CLIENT_SECRET = "test";
  process.env.SPOTIFY_REFRESH_TOKEN = "test";
  const fetchMock = t.mock.method(globalThis, "fetch");
  t.mock.method(console, "error", (...args: Parameters<typeof console.error>) =>
    loggedErrors.push(args),
  );

  const verify = async (
    request: () => Promise<Response>,
    expectedCalls: number,
    expectedStatus: number,
  ) => {
    fetchMock.mock.resetCalls();
    fetchMock.mock.mockImplementation(request);

    const response = await GET();

    assert.equal(fetchMock.mock.callCount(), expectedCalls);
    assert.equal(response.status, expectedStatus);
    assert.deepEqual(await response.json(), {
      message: "spotify is temporarily unavailable",
    });
  };

  try {
    await verify(async () => new Response(null, { status: 503 }), 3, 503);
    await verify(async () => new Response(null, { status: 401 }), 1, 500);
    await verify(async () => new Response(null, { status: 429 }), 1, 500);
    await verify(
      async () => {
        throw new TypeError("network error");
      },
      3,
      503,
    );
    assert.equal(loggedErrors.length, 4);
    assert.match(String(loggedErrors[0]?.[1]), /\(503\)/);
    assert.match(String(loggedErrors[1]?.[1]), /\(401\)/);
    assert.match(String(loggedErrors[2]?.[1]), /\(429\)/);
  } finally {
    for (const [name, value] of Object.entries({
      SPOTIFY_CLIENT_ID: originalEnv.clientId,
      SPOTIFY_CLIENT_SECRET: originalEnv.clientSecret,
      SPOTIFY_REFRESH_TOKEN: originalEnv.refreshToken,
    })) {
      if (value === undefined) {
        delete process.env[name];
      } else {
        process.env[name] = value;
      }
    }
  }
});
