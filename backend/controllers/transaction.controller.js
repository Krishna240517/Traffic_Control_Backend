import { Transaction } from "../models/transaction.model.js";
import { Fine } from "../models/fine.model.js";
import { Toll } from "../models/toll.model.js";
import { User } from "../models/user.model.js";
import mongoose from "mongoose";

export const createTransaction = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { userId, vehicleId, type, amount, referenceId, typeRef, location } = req.body;
        const user = await User.findById(req.user._id).session(session);
        if (!user) return res.status(401).json({ msg: "User Not Found" });

        let transactionStatus = "pending";

        if (type === "fine") {
            const fine = await Fine.findById(referenceId).session(session);
            if (!fine) return res.status(401).json({ msg: "Fine Not Issued / Found" });
            if (fine.status === "paid") return res.status(401).json({ msg: "Fine Already Paid" });

            if (user.walletBalance >= amount) {
                user.walletBalance -= amount;
                fine.status = "paid";
                fine.paidAt = Date.now();
                await fine.save({ session });
                transactionStatus = "successs";
            } else {
                transactionStatus = "failed";
            }
        }

        else if (type === "toll") {
            const toll = await Toll.findById(referenceId).session(session);
            if (!toll) return res.status(401).json({ msg: "Toll Not Found" });
            if (user.walletBalance >= amount) {
                user.walletBalance -= amount;
                transactionStatus = "success";
            } else {
                transactionStatus = "failed";
            }
        }
        else if (type === "topup") {
            user.walletBalance += amount;
            transactionStatus = "success";
        }

        await user.save({ session });


        const transaction = new Transaction({
            userId,
            vehicleId,
            type,
            amount,
            status: transactionStatus,
            referenceId,
            typeRef,
            location
        });

        await transaction.save({ session });
        await session.commitTransaction();
        session.endSession();

        return res.status(201).json({ info: transaction });
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        console.error("Error in createTransaction:", error);
        return res.status(400).json({ message: error.message });
    }
};


export const getUserTransactions = async (req, res) => {
    try {
        const { userId: id } = req.params;
        const transactions = await Transaction.find({ userId: id })
            .populate("vehicleId", "plateNumber type")
            .populate("referenceId");
        if (!transactions) return res.status(404).json({ msg: "User didn't make any transactions" });
        res.status(201).json({ info: transactions });
    } catch (error) {
        console.error("Error in getUserTransactions:", error);
        res.status(500).json({ message: "Server error" });
    }
};

export const getAllTransactions = async (req, res) => {
    try {
        const transactions = await Transaction.find()
            .populate("userId", "name email")
            .populate("vehicleId", "plateNumber type")
            .populate("referenceId")
        if (!transactions) return res.status(404).json({ msg: "No Transaction found" });
        res.status(201).json({ info: transactions });
    } catch (error) {
        console.error("Error in getAllTransactions:", error);
        res.status(500).json({ message: "Server error" });
    }
};


export const getParticularTransaction = async (req, res) => {
    try {
        const { transId } = req.params;
        const transaction = await Transaction.findById(transId)
            .populate("userId", "name email")
            .populate("vehicleId", "plateNumber type")
            .populate("referenceId")
        if (!transaction) return res.status(404).json({ msg: "No Transaction found" });
        res.status(201).json({ info: transaction });
    } catch (error) {
        console.error("Error in getAllTransactions:", error);
        res.status(500).json({ message: "Server error" });
    }
};

export const updateTransaction = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const { transId } = req.params;
        const { status } = req.body;
        const filter = {};
        if(status) {
            filter.status = status;
        }
        const transaction = await Transaction.findByIdAndUpdate(transId,filter,{new: true, runValidators: true});
        if(!transaction) return res.status(404).json({ msg: "No Transaction found" });
        res.status(201).json({msg:"Transaction Updated", info: transaction});
    } catch (error) {
        console.error("Error in updateTransaction:", error);
        res.status(500).json({ message: "Server error" });
    }
}