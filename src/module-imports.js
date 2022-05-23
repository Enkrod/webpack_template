// module-imports.js
const path = require("path");

const resources = [
    "scss/utils/_variables.scss"
];
module.exports = resources.map(file => path.resolve(__dirname, file));
