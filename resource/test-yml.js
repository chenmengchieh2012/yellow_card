const yaml = require('js-yaml');
const fs = require('fs');
let obj = yaml.safeLoad(fs.readFileSync('development.yml', 'utf8'));
console.log(obj.env.prefix);