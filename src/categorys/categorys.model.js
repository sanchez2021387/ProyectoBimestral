import mongoose from 'mongoose';


const categorysSchema = mongoose.Schema({
    nameCategorys: {
        type: String,
        required: [true, "The name is requerid"]
    },
    state: {
        type: Boolean,
        default: true
    }
})

export default mongoose.model('Categorys', categorysSchema);