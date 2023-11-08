import { User } from "./user.js";
import { Theme } from "./theme.js";
import { Image } from './image.js'

await User.hasMany(Theme, { as: "themes", onDelete: 'CASCADE' });

await Theme.hasMany(Image, { as: "images", onDelete: 'CASCADE' });

await Image.belongsTo(Theme, {
    as: "image",
    onDelete: 'CASCADE'
});

await Theme.belongsTo(User, {
    as: "theme",
    onDelete: 'CASCADE'
});

await User.sync({});
await Theme.sync({})
await Image.sync({})


export {
    User,
    Theme,
    Image
}