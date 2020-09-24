const ObjectsToCsv = require('objects-to-csv');
for(let i = 0;i<10;i++) {
    data.push({
        name: i.toString(),
        job: i.toString(),
        age: i.toString()
    });
}
new ObjectsToCsv(data).toDisk('./test.csv', { append: true });