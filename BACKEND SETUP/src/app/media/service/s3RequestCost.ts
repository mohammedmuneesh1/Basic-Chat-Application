


//✅  ✅  ✅   NEED TO CHECK IT'S WORKING  ✅  ✅  ✅ 




// import AWS from 'aws-sdk';
// import readline from 'readline';

// // ✅ Configure AWS SDK with Credentials
// const s3 = new AWS.S3({
//     region: 'your-region',  // e.g., 'ap-south-1'
//     accessKeyId: process.env.AWS_ACCESS_KEY_ID,
//     secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,

// });

// interface Counts {
//     [customerId: string]: {
//         GET: number;
//         PUT: number;
//         DELETE: number;
//     };
// }

// const parseLogs = async (logBucket: string, logPrefix: string): Promise<Counts> => {
//     const counts: Counts = {};

//     const list = await s3.listObjectsV2({
//         Bucket: logBucket,
//         Prefix: logPrefix,
//     }).promise();

//     if (!list.Contents) return counts;

//     for (const obj of list.Contents) {
//         const logStream = s3.getObject({
//             Bucket: logBucket,
//             Key: obj.Key!,
//         }).createReadStream();

//         const rl = readline.createInterface({
//             input: logStream,
//             crlfDelay: Infinity,
//         });

//         for await (const line of rl) {
//             const parts = line.split(' ');

//             const operation = parts[2]; // Example: "REST.GET.OBJECT"
//             const objectKey = parts[7]; // Example: "customers/customerA/image.jpg"

//             if (!objectKey.startsWith('customers/')) continue;

//             const customerId = objectKey.split('/')[1]; // Extract 'customerA'

//             if (!counts[customerId]) {
//                 counts[customerId] = { GET: 0, PUT: 0, DELETE: 0 };
//             }

//             if (operation === 'REST.GET.OBJECT') counts[customerId].GET++;
//             else if (operation === 'REST.PUT.OBJECT') counts[customerId].PUT++;
//             else if (operation === 'REST.DELETE.OBJECT') counts[customerId].DELETE++;
//         }
//     }

//     return counts;
// };

// // ✅ Example Usage
// const logBucket = 'your-s3-access-log-bucket';
// const logPrefix = 'AWSLogs/your-account-id/S3/your-s3-bucket-name/';

// parseLogs(logBucket, logPrefix)
//     .then(counts => {
//         console.log('Per Customer Request Counts:', counts);
//     })
//     .catch(error => {
//         console.error('Error parsing logs:', error);
//     });
