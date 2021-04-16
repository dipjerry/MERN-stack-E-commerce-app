const fetchData = () => {
    const promise = new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve('Done!');
        }, 1500);
    });
    return promise;
};
// const fetchData = (callback) => {
//     setTimeout(() => { callback('data') }, 1500)
// };
// setTimeout(() => {
//     console.log('Timer complete , asynchronous');
//     fetchData(text => { console.log(text); });
// }, 2000);
setTimeout(() => {
    console.log('Timer complete , asynchronous');
    fetchData()
        .then(text => {
            console.log(text);
            return fetchData();
        })
        .then(text2 => {
            console.log(text2);
            // return fetchData();
        });
}, 2000);

console.log('synchronous')