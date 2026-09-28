import arcjet, { shield, detectBot, tokenBucket, slidingWindow } from "@arcjet/node";

const aj = arcjet({
  key: process.env.ARCJET_KEY,
  rules: [
    shield({ mode: "LIVE" }),
    detectBot({
      mode: process.env.ARCJET_ENV === "development"? "DRY_RUN": "LIVE",
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