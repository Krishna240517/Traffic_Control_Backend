import mongoose from "mongoose";
const transactionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    vehicleId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Vehicle",
        required: true
    },

    type: {
        type: String,
        enum: ["fine", "toll", "topup"],
        required: true
    },

    amount: {
        type: Number,
        required: true
    },

    status: {
        type: String,
        enum: ["success", "failed", "pending"],
        default: "pending"
    },
    
    referenceId: {
        type: mongoose.Schema.Types.ObjectId,
        refPath: "typeRef" 
    },
    typeRef: {
        type: String,
        enum: ["Fine", "Toll", null]
    },
    location: {
        type: {
            type: String,
            enum: ["Point"],
            default: "Point"
        },
        coordinates: {
            type: [Number],
            required: function () {
                return this.type !== "topup";
            }
        }
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
});

transactionSchema.index({ location: "2dsphere" });


transactionSchema.virtual("lat").get(function() {
    return this.location.coordinates[1];
});

transactionSchema.virtual("lng").get(function() {
    return this.location.coordinates[0];
})

const Transaction = mongoose.model("Transaction",transactionSchema);
export { Transaction };