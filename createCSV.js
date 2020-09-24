const ObjectsToCsv = require('objects-to-csv');
const data = [];
for(let i = 0;i<1e5;i++) {
    data.push({
        name: i.toString(),
        job: i.toString(),
        age: i.toString()
    });
}
new ObjectsToCsv(data).toDisk('./test.csv', { append: true });
