const fs = require('fs');
let code = fs.readFileSync('src/app/page.jsx', 'utf8');

const targetIds = ['k5', 'l4', 's4', 'n4', 'n6'];
targetIds.forEach(id => {
  const regex = new RegExp(`(id:\\s*'${id}'.*?image:\\s*)\`/sweets/${id}.png\``);
  code = code.replace(regex, `$1null`);
});

fs.writeFileSync('src/app/page.jsx', code);
console.log('Successfully set unknown images to null in page.jsx');
