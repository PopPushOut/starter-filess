const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const slug = require('slugs');

const storeSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: 'please enter store name!'
    },
    slug: String,
    description: {
        type: String,
        trim: true
    },
    tags: [String],
    created: {
        type: Date,
        default: Date.now()
    },
    location: {
        type: {
            type: String,
            default: 'Point'
        },
        coordinates: [{
            type: Number,
            required: 'You must supply your coordinates!'
        }],
        address: {
            type: String,
            required: 'You must supply your address!'
        }
    },
    photo: String,
    author: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: 'Your must supply an author'
    }
});
storeSchema.pre('save', async function(next) {
    if (!this.isModified('name')) {
        next(); // skip it
        return; // stop this function from running
    }
    this.slug = slug(this.name);
    // find other stores that have a slug of wes, wes-1, wes-2
    const slugRegEx = new RegExp(`^(${this.slug})((-[0-9]*$)?)$`, 'i');
    const storesWithSlug = await this.constructor.find({ slug: slugRegEx });
    if(storesWithSlug.length) {
        this.slug = `${this.slug}-${storesWithSlug.length + 1}`;
    }
    next();
    // TODO make more resiliant so slugs are unique
});

// Define our indexes
storeSchema.index({
    name: 'text',
    description: 'text'
});

storeSchema.statics.getTagsList = function() {
    return this.aggregate([
        {
            $unwind: '$tags'
        },
        {
            $group: { _id: '$tags', count: { $sum: 1 }}
        },
        {
            $sort: { count: - 1 }
        }
    ]);
}
module.exports = mongoose.model('Store', storeSchema)