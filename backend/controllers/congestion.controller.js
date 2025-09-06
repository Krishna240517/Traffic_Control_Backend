import { Tracking } from "../models/tracking.model.js";

export const getCurrentCongestion = async (req, res) => {
    try {
        const latest = await Tracking.aggregate([
            { $sort: { timestamp: -1 } },
            {
                $group: {
                    _id: "$vehicleId",
                    doc: { $first: "$$ROOT" }
                }
            }
        ]);
        const result = latest.map(item => ({
            vehicleId: item.doc.vehicleId,
            lat: item.doc.location.coordinates[1],
            lng: item.doc.location.coordinates[0],
            congestionLevel: item.doc.congestionLevel,
            speed: item.doc.speed,
            timestamp: item.doc.timestamp
        }));

        res.status(201).json({ info: result });
    } catch (error) {
        console.error("Error in current congestion controller", error.message);
        return res.status(500).json({ msg: "Internal Server Error" });
    }
};


export const getCongestionStats = async (req, res) => {
    try {
        const stats = await Tracking.aggregate([
            {
                $group: {
                    _id: {
                        year: { $year: "$timestamp" },
                        month: { $month: "$timestamp" },
                        day: { $dayOfMonth: "$timestamp" },
                        hour: { $hour: "$timestamp" },
                        minute: { $minute: "$timestamp" }
                    },
                    avgCongestion: { $avg: "$congestionLevel" }
                }
            },
            {$sort: { "_id":1 }}
        ]);

        res.status(201).json({info: stats});
    } catch (error) {
        console.error("Error in current congestion stats controller", error.message);
        return res.status(500).json({ msg: "Internal Server Error" });
    }
}