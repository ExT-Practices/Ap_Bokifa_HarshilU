const SYNC_CHANNEL_NAME = "bookify_sync_channel";

export const subscribeToDataChanges = (onUpdateCallback, pollingMs = 3000) => {
  let channel = null;

  const handleUpdate = () => {
    if (typeof onUpdateCallback === "function") {
      onUpdateCallback();
    }
  };

  // 1. BroadcastChannel Listener (Instant 0ms update across open tabs)
  if (typeof window !== "undefined" && "BroadcastChannel" in window) {
    try {
      channel = new BroadcastChannel(SYNC_CHANNEL_NAME);
      channel.onmessage = (event) => {
        if (event.data?.type === "DATA_UPDATED") {
          handleUpdate();
        }
      };
    } catch (e) {
      console.warn("BroadcastChannel initialization error:", e);
    }
  }

  // 2. Storage Event Listener (For cross-window sync fallback)
  const handleStorageEvent = (event) => {
    if (event.key === "bookify_last_update") {
      handleUpdate();
    }
  };
  window.addEventListener("storage", handleStorageEvent);

  // 3. Tab Focus Listener (When user switches back to client tab)
  const handleFocus = () => {
    handleUpdate();
  };
  window.addEventListener("focus", handleFocus);

  // 4. Polling Timer (Heartbeat update every 3s)
  const timer = setInterval(handleUpdate, pollingMs);

  // Cleanup function
  return () => {
    if (channel) {
      channel.close();
    }
    window.removeEventListener("storage", handleStorageEvent);
    window.removeEventListener("focus", handleFocus);
    clearInterval(timer);
  };
};
