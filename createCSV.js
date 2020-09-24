const ObjectsToCsv = require('objects-to-csv');
const data = [
    // {
    //     "name": "Ritwiz",
    //     "job": "Developer",
    //     "age": "20"
    // },
    // {
    //     "name": "John",
    //     "job": "Lawyer",
    //     "age": "32"
    // },
    // {
    //     "name": "Cecily",
    //     "job": "Consultant",
    //     "age": "29"
    // }
]
for(let i = 0;i<10;i++) {
    data.push({
        name: i.toString(),
        job: i.toString(),
        age: i.toString()
    });
}
new ObjectsToCsv(data).toDisk('./test.csv', { append: true });