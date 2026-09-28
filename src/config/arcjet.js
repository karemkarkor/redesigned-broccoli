import arcjet, { shield, detectBot, tokenBucket, slidingWindow } from "@arcjet/node";

const aj = arcjet({
  key: process.env.ARCJET_KEY,
  rules: [
    shield({ mode: "LIVE" }),
    detectBot({
      mode: "DRY_RUN",
      allow: [
        "CATEGORY:SEARCH_ENGINE",
        "CATEGORY:MONITOR"
      ],
    }),
    slidingWindow({
      mode: "LIVE",
      interval: "2s",
      max: 5
    })
  ],
});

export default aj;