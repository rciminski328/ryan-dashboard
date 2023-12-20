const mqtt = require("mqtt");

const refrigeratorAssetId = "628aef25-734f-4075-8d0d-2150ed842406";
const storeAssetId = "f47fa820-6005-410b-88b3-652f7c8bc7eb";
const userToken = "";
const systemKey = "";

const platformUrl = "https://assets.clearblade.com";
const client = mqtt.connect("tls://assets.clearblade.com:1884", {
  username: userToken,
  password: systemKey,
});

client.on("connect", async () => {
  const fridge = await fetchAsset(refrigeratorAssetId);
  publishData(fridge);
});

client.on("error", (e) => {
  // eslint-disable-next-line no-console
  console.log("mqtt error", e);
});

/**
 *
 * @param {{custom_data: {motion?: boolean; motionCount?: number}}} fridge
 */
async function publishData(fridge) {
  let motion =
    typeof fridge.custom_data.motion !== "undefined"
      ? fridge.custom_data.motion
      : true;
  let motionCount =
    typeof fridge.custom_data.motionCount !== "undefined"
      ? motion
        ? fridge.custom_data.motionCount + 1
        : fridge.custom_data.motionCount
      : 1;
  for (let i = 0; i < 1000; i++) {
    // eslint-disable-next-line no-console
    console.log(`publish iteration ${i}`);
    client.publish(
      "_monitor/asset/default/data",
      JSON.stringify({
        id: refrigeratorAssetId,
        type: "refrigerator",
        custom_data: {
          temperature: getRandomInt(30, 50),
          humidity: getRandomInt(10, 70),
          isRunning: true,
          doorOpen: i % 2 === 0 ? true : false,
          motion,
          motionCount,
        },
      })
    );

    client.publish(
      "_monitor/asset/default/data",
      JSON.stringify({
        id: storeAssetId,
        type: "store",
        custom_data: {
          co2: getRandomInt(300, 1300),
          temperature: getRandomInt(50, 76),
          humidity: getRandomInt(10, 80),
          occupancy: getRandomInt(10, 50),
        },
      })
    );

    await sleep(getRandomInt(4000, 9000));
    motion = !motion;
    motionCount++;
  }
}

/**
 *
 * @param {string} assetId
 */
async function fetchAsset(assetId) {
  const resp = await fetch(
    `${platformUrl}/api/v/1/code/${systemKey}/fetchTableItems?id=assetsv2.read`,
    {
      headers: {
        "CLEARBLADE-USERTOKEN": userToken,
      },
      body: JSON.stringify({
        name: "assetsv2.read",
        body: {
          query: {
            Filters: [
              [
                {
                  type: "default",
                  operator: "=",
                  field: "id",
                  value: assetId,
                },
              ],
            ],
            Order: [],
            Columns: [],
            PageNumber: 1,
            PageSize: 1000,
            SearchText: "",
            RowGroupingFilters: [],
          },
        },
      }),
      method: "POST",
    }
  );

  if (!resp.ok) {
    const text = await resp.text();
    throw new Error(text);
  }

  const data = await resp.json();

  const asset = data.results.DATA[0];

  if (typeof asset === "undefined") {
    throw new Error(`No asset found with id '${assetId}'`);
  }

  return { ...asset, custom_data: JSON.parse(asset.custom_data) };
}

/**
 *
 * @param {number} ms
 * @returns {Promise<void>}
 */
function sleep(ms) {
  return new Promise((res) => setTimeout(res, ms));
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
