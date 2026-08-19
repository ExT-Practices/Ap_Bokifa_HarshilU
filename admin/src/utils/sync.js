// Broadcast channel & storage event helper for instant real-time client updates
const SYNC_CHANNEL_NAME = "bookify_sync_channel";

let channel = null;
if (typeof window !== "undefined" && "BroadcastChannel" in window) {
  channel = new BroadcastChannel(SYNC_CHANNEL_NAME);
}

export const notifyDataChange = (entityType = "ALL") => {
  const payload = {
    type: "DATA_UPDATED",
    entity: entityType,
    timestamp: Date.now()
  };

  if (channel) {
    try {
      channel.postMessage(payload);
    } catch (e) {
      console.warn("BroadcastChannel error:", e);
    }
  }

  try {
    localStorage.setItem("bookify_last_update", JSON.stringify(payload));
  } catch (e) {
    // Ignore storage errors
  }
};
