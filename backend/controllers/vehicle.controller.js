import { Vehicle } from "../models/vehicle.model.js";

export const registerVehicle = async (req, res) => {
    try {
        const { ownerId, plateNumber,type, obuId } = req.body;
        const vehicle = await Vehicle.findOne({
            $or:[{plateNumber},{obuId}]
        });
        if(vehicle) return res.status(400).json({msg:"Vehicle Already Registered"});
        

        const newVehicle = new Vehicle({
            ownerId,
            plateNumber,
            type,
            obuId
        });

        await newVehicle.save();
        res.status(200).json({
            msg:"Vehicle Registered Successfully",
            data: newVehicle
        });
    } catch (error) {
        console.log("Error in register vehicle controller",error.message);
        return res.status(500).json({msg:"Internal Server Error"});
    }
};

export const getMyVehicles = async (req, res) => {
    try {
        const vehicles = await Vehicle.find({ownerId: req.user._id});
        if(!vehicles) return res.status(400).json({msg: "No Registered Vehicles Yet"});
        res.status(200).json({data: vehicles});
    } catch (error) {
        console.log("Error in get my vehicles controller",error.message);
        return res.status(500).json({msg:"Internal Server Error"});
    }
}

export const getVehicle = async(req, res) => {
    try {
        const {type, ownerId} = req.query;
        const filter = {};
        if(type) filter.type = type;
        if(ownerId) filter.ownerId = ownerId;

        const vehicleList = await Vehicle.find(filter).populate("ownerId","name email");
        res.status(200).json({data: vehicleList});
    } catch (error) {
        console.log("Error in get my vehicles controller",error.message);
        return res.status(500).json({msg:"Internal Server Error"});
    }
};


export const deleteVehicle = async(req, res) => {
    try {
        const { id: vehicleId } = req.params;
        const vehicle = await Vehicle.findByIdAndDelete(vehicleId);
        if(!vehicle) {
            return res.status(404).json({ message: "Vehicle not found" });
        }
        res.status(200).json({ message: "Vehicle deleted successfully" });
    } catch (error) {
        console.log("Error in delete vehicle controller",error.message);
        return res.status(500).json({msg:"Internal Server Error"});
    }
}

export const updateVehicle = async(req, res) => {
    try {
        const { plateNumber, type, obuId, status } = req.body;
        const filter = {};
        if(plateNumber) filter.plateNumber = plateNumber;
        if(type) filter.type = type;
        if(obuId) filter.obuId = obuId;
        if(status) filter.status = status;


        const { id: vehicleId } = req.params;

        const vehicle = await Vehicle.findByIdAndUpdate(vehicleId,filter,{new: true, runValidators: true});
        if(!vehicle) {
            return res.status(404).json({ message: "Vehicle not found" });
        }

        res.status(200).json({
            msg:"Vehicle Updated Successfully",
            data: vehicle
        });
    } catch (error) {
        console.log("Error in update vehicle controller",error.message);
        return res.status(500).json({msg:"Internal Server Error"});
    }
}