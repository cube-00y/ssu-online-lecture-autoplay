declare global {
  namespace NodeJS {
    interface ProcessEnv {
      PLAYBACK_LATE: "0.5" | "1.0" | "1.25" | "1.5" | "2.0"
    }
  }
}

export {}
