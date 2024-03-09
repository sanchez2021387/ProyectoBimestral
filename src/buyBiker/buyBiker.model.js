import mongoose from "mongoose";

const BuySchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    shopping: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Shopping',
        required: true
    },
    total: {
        type: Number,
        required: true
    },
});

export default mongoose.model('Buy', BuySchema);