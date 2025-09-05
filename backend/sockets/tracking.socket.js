import { saveTracking } from "../services/tracking.service.js";
import { updateCongestionFromTracking } from "../services/congestion.service.js";
import { checkAndSendAlerts } from "../services/notification.service.js";

export default (io) => {
  io.on("connection", (socket) => {
    console.log("🟢 Client connected:", socket.id);

    // ✅ Client identifies itself (driver or admin)
    socket.on("register", ({ userId, role }) => {
      if (userId) {
        socket.join(userId.toString()); // private room for driver
        console.log(`👤 User ${userId} joined their private room`);
      }
      if (role === "admin") {
        socket.join("admin"); // special room for admins
        console.log(`🛠️ Admin joined the admin room`);
      }
    });

    // ✅ Driver sends live location
    socket.on("sendLocation", async ({ userId, vehicleId, lat, lng, speed }) => {
      try {
        // 1. Save tracking point
        const tracking = await saveTracking(vehicleId, lat, lng, speed);

        // 2. Update congestion for nearest toll
        const toll = await updateCongestionFromTracking(tracking);

        // 3. Broadcast congestion update (all clients)
        if (toll) {
          io.emit("congestionUpdate", {
            tollId: toll._id,
            congestionLevel: toll.congestionLevel,
            location: toll.location.coordinates,
            updatedAt: toll.updatedAt,
          });
        }

        // 4. Check & send alerts (driver-only via private room)
        await checkAndSendAlerts(userId, vehicleId, tracking, io);

        // 5. Broadcast vehicle update (only to admins)
        io.to("admin").emit("vehicleUpdate", {
          vehicleId,
          lat,
          lng,
          speed,
          timestamp: tracking.timestamp,
        });
      } catch (err) {
        console.error("❌ Error in sendLocation:", err.message);
      }
    });

    socket.on("disconnect", () => {
      console.log("🔴 Client disconnected:", socket.id);
    });
  });
};
