const mqtt = require("mqtt");

const refrigeratorAssetId = "628aef25-734f-4075-8d0d-2150ed842406";
const storeAssetId = "f47fa820-6005-410b-88b3-652f7c8bc7eb";
const userToken = "";
const systemKey = "";

const client = mqtt.connect("tls://assets.clearblade.com:1884", {
  username: userToken,
  password: systemKey,
});

client.on("connect", () => {
  publishData();
});

client.on("error", (e) => {
  // eslint-disable-next-line no-console
  console.log("mqtt error", e);
});

async function publishData() {
  for (let i = 0; i < 1000; i++) {
    // eslint-disable-next-line no-console
    console.log(`publish iteration ${i}`);
    client.publish(
      "_monitor/asset/default/data",
      JSON.stringify({
        id: refrigeratorAssetId,
        type: "refrigerator",
        custom_data: {
          temperature: getRandomInt(5, 50),
          humidity: getRandomInt(20, 70),
          isRunning: true,
          doorOpen: i % 2 === 0 ? true : false,
        },
      })
    );

    client.publish(
      "_monitor/asset/default/data",
      JSON.stringify({
        id: storeAssetId,
        type: "store",
        custom_data: {
          co2: getRandomInt(300, 400),
          tempurature: getRandomInt(60, 70),
          humidity: getRandomInt(10, 30),
          occupancy: getRandomInt(10, 50),
        },
      })
    );

    await sleep(5000);
  }
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
