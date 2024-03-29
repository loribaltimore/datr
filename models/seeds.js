const mongoose = require('mongoose');
const database = require('./database');
const User = require('./userSchema');
const Connection = require('./connectionSchema');
const hobbies = require('../util/hobbies');
const casual = require('casual');
const coords = require('../util/coords');
const userSorting = require('../lib/userSorting');
const fs = require('fs');
const { GridFSBucket } = require('mongodb');
const { sortFunction } = require('../lib/userSorting');
const distanceCrawl = require('../lib/distanceCrawl');

const zodiacSigns = [
    "Aries",
    "Taurus",
    "Gemini",
    "Cancer",
    "Leo",
    "Virgo",
    "Libra",
    "Scorpio",
    "Sagittarius",
    "Capricorn",
    "Aquarius",
    "Pisces"
];

const sortingCheck = async () => {
    await database();
    const results = await userSorting('male', 20, 5, [-122.257935, 47.784021], "64b6950daa27fe5fa6c399d7");
    console.log(results.length);
};

const seedUser = async () => {
    const client = await database();
    await User.deleteMany({ name: { $ne: 'Jenny' }, username: { $ne: 'Powerman5000' } });
    for (let i = 0; i < 200; i++){
        // console.log(i);
        const randHobby = Math.floor(Math.random() * (hobbies.length / 2));
        const randAge = Math.floor(Math.random() * 30);
        const randGenderId = Math.floor(Math.random() * 3);
        const randPhoto = Math.floor(Math.random() * 23 + 1);
       const currentUser = await new User({
        username: casual.username,
        name: casual.first_name,
           description: casual.sentences(n = 4),
        sign: zodiacSigns[Math.floor(Math.random() * zodiacSigns.length)],
           hobbies: hobbies.slice(randHobby, randHobby + 6),
            location: {
                geo: {
                    coordinates: distanceCrawl(i)
        }
           },
            preferences: {
        range: Math.floor(Math.random() * 20),
        gender: ['male', 'female', 'non-binary', 'other'][randGenderId],
        age: randAge + 18
    },
        genderId: ['male', 'female', 'non-binary', 'other'][randGenderId],
        age: randAge + 18
       })
        fs.readFile(randAge % 2 === 0 ? `../public/Women Photos Datr/${randPhoto}.jpg` : `../public/Men Photos Datr/${randPhoto}.jpg`, (err, data) => {
            if (err) {
                throw err;
            };
            const buffer = Buffer.from(data);
            const db = client.useDb('myFirstDatabase');
            const bucket = new GridFSBucket(db);
            // console.log(buffer);
            const filename = casual.word + '.jpg';
            const uploadStream = bucket.openUploadStream(filename,  {contentType:'image/jpg'});
            uploadStream.write(buffer);
            uploadStream.on('close', async function (file) {
                currentUser.photos.push(uploadStream.id.toString());
                // if (currentUser.photos.length === 1) {
                //     await currentUser.save();
                // }
            });
            uploadStream.end();
            uploadStream.on('finish', function () {
                console.log('PHOTO UPLOADED');
            });
        });

        await currentUser.save();
        console.log(currentUser);
        console.log('User saved')
    };
};
const seedThemTrivia = async () => {
    await database();
    const currentUser = await User.findById('64811cb221c21a50a0ee5ae5');
    currentUser.connections.set('6483673fec9f01df94986700', {
        id: '6483673fec9f01df94986700', status: 'reciprocated', conversation: [], trivia: {
            me: false,
            them: [
                {
                    question: 'What kind of music do you enjoy2?',
                    answer: 'Pop'
                },
                {
                    question: 'What is your favorite movie genre?',
                    answer: 'Action'
                },
                {
                    question: 'Are you an early bird or a night owl?',
                    answer: 'Early bird'
                },
                {
                    question: 'What is your favorite movie genre?',
                    answer: 'Action'
                },
                {
                    question: 'Do you prefer coffee or tea?',
                    answer: 'Coffee'
                }
            ]
        }, review: {}
    });

    const connection = await User.findById('6483673fec9f01df94986700');
    connection.connections.set(currentUser._id, {
        id: currentUser._id, status: 'reciprocated', conversation: [], trivia: {
            them: false,
            me: [
                {
                    question: 'What kind of music do you enjoy1?',
                    answers: ['Pop', 'Rock', 'Country', 'Rap'],
                    chosen: 'Pop'
                },
                {
                    question: 'What is your favorite movie genre?',
                    answers: ['Action', 'Comedy', 'Drama', 'Horror'],
                    chosen: 'Action'
                },
                {
                    question: 'Are you an early bird or a night owl?',
                    answers: ['Early bird', 'Night owl', 'Neither', 'Both'],
                    chosen: 'Early bird'
                },
                {
                    question: 'What is your favorite season?',
                    answers: ['Summer', 'Winter', 'Spring', 'Fall'],
                    chosen: 'Summer'
                },
                {
                    question: 'Do you prefer coffee or tea?',
                    answers: ['Coffee', 'Tea', 'Neither', 'Both'],
                    chosen: 'Coffee'
                },
                {
                    question: 'Do you prefer forest or beack?',
                    answers: ['Forest', 'Beach', 'Neither', 'Both'],
                    chosen: 'Beach'
                }
            ]
        }, review: {}
    });
    
    await connection.save();
    await currentUser.save();
console.log("THEM TRIVIA SEEDED")
};

const seedConnections = async () => {
    await database();
    console.log('WOrking')
    const currentUser = await User.findOne({ name: 'Jenny' }).then(data => { return data} ).catch(err => console.log(err));
    const users = await User.find({})
        .then(data => { return data }).catch(err => console.log(err));
    currentUser.connections.reciprocated = [];
    currentUser.rating.looks.count = 1;
    currentUser.rating.looks.total = 5;
    currentUser.rating.looks.avg = 5;
    currentUser.rating.looks.metricsByAge = new Map();
    currentUser.connections.pending = [];
    currentUser.connections.matched = [];
    currentUser.connections.rejectedBy = [];
    currentUser.interestAndPass.byTotal = [{ interested: 0, pass: 0 }];
    currentUser.interestAndPass.interested.count = 0;
    currentUser.interestAndPass.pass.count = 0;
    currentUser.rating.looks.metricsByAge.set(currentUser.age.toString(), { total: 5, count: 1 });
        await currentUser.save();
    for (let i = 1; i < 145; i++) {
        users[i].rating.looks.avg = Math.floor(Math.random() * 7 + 3);
        
        const rand = Math.floor(Math.random() * 2);
        users[i].personality = {
        openness: rand % 2 === 0 ? Math.floor(Math.random() * 4) : -Math.floor(Math.random() * 4),
        conscientiousness: rand % 2 === 0 ? Math.floor(Math.random() * 4) : -Math.floor(Math.random() * 4),
        extraversion: rand % 2 === 0 ? Math.floor(Math.random() * 4) : -Math.floor(Math.random() * 4),
        agreeableness: rand % 2 === 0 ? Math.floor(Math.random() * 4) : -Math.floor(Math.random() * 4),
            neuroticism: rand % 2 === 0 ? Math.floor(Math.random() * 4) : -Math.floor(Math.random() * 4)
        }
        users[i].rating.looks.count = 5;
        users[i].rating.looks.total = users[i].rating.looks.avg * 5;
        await users[i].save();
        if (currentUser._id !== users[i]._id) {
            if (currentUser.connections.matched.length < 6 && i % 2 === 0) {
                currentUser.connections.matched.push(users[i]._id);

                const newConnection = await new Connection({
            connection1:{name: currentUser.name, id: currentUser._id, photo: currentUser.photos},
             connection2: { name: users[i].name, id: users[i]._id, photo: users[i].photos},
             compatibility: {
                openness: 10 - Math.abs(Math.round(currentUser.personality['openness'] - users[i].personality['openness'])),
        conscientiousness: 10 - Math.abs(Math.round(currentUser.personality['conscientiousness'] - users[i].personality['conscientiousness'])),
        extraversion: 10 - Math.abs(Math.round(currentUser.personality['extraversion'] - users[i].personality['extraversion'])),
        agreeableness: 10 - Math.abs(Math.round(currentUser.personality['agreeableness'] - users[i].personality['agreeableness'])),
        neuroticism: 10 - Math.abs(Math.round(currentUser.personality['neuroticism'] - users[i].personality['neuroticism']))
                    },
           }).save();
                currentUser.connections.reciprocated.push(newConnection.id);
                users[i].connections.reciprocated.push(newConnection.id);
                users[i].notifications.chat.push({from: currentUser.name});
                currentUser.notifications.chat.push({from: currentUser.name});
                await users[i].save();
            } else if (currentUser.connections.pending.length < 13 && i % 2 === 0 && i % 3 === 0 && i % 5 !== 0) { 
                currentUser.connections.pending.push(users[i]._id);
            } else {
                currentUser.connections.rejectedBy.push(users[i]._id);
            }
            const rand2 = Math.floor(Math.random() * 100);
            let isInterested;
                if (i % 3 === 0 && i % 4 !== 0 && i % 5 === 0)  {
                    isInterested = 'dated';
                } else if (i % 2 === 0 && i % 3 === 0 && i % 4 !== 0)  {
                    isInterested = 'matched';
                } else if (i % 2 === 0) {
                    isInterested = 'interested';
                } else {
                    isInterested = 'pass';
            };
                const totalInteractions = currentUser.interestAndPass.interested.count + currentUser.interestAndPass.pass.count;
            const increment = Math.floor(totalInteractions / 50);
    console.log(totalInteractions);
    console.log(increment, 'increment');
    if (!currentUser.interestAndPass.byTotal[increment]) {
            currentUser.interestAndPass.byTotal.push({ interested: 0, pass: 0, matched: 0, dated: 0 });
    };
            currentUser.interestAndPass.byTotal[increment][isInterested] += 1;
                
    isInterested !== 'matched' && isInterested !== 'dated' ?
        currentUser.interestAndPass[isInterested].count += 1 : null;

            const choices = { 0: 1 * Math.abs(currentUser.rating.looks.avg - users[i].rating.looks.avg)  , 1: -1 * Math.abs(currentUser.rating.looks.avg - users[i].rating.looks.avg), 2: 2 * Math.abs(currentUser.rating.looks.avg - users[i].rating.looks.avg), 3: 0 };
            currentUser.rating.looks.count+=1;
            currentUser.rating.looks.total += currentUser.rating.looks.avg + choices[rand2 <= 25 ? '0' : rand2 >= 50 ?  '3' : rand2 < 75 && i % 3 === 0 ? '1' : rand2 < 75  ? '2': '0'  ]; 
            currentUser.rating.looks.avg = Math.round(currentUser.rating.looks.total / currentUser.rating.looks.count);
            // console.log(Math.abs(users[i].rating.looks.avg - currentUser.rating.looks.avg), 'DIFFERENCE');
            // console.log(rand2)
            // console.log(currentUser.rating.looks.avg, 'AVERAGE');
            // console.log('PLUS')
            // console.log(choices[rand2 <= 25 ? '0' : rand2 > 50 ? '1' : '2'], 'RaND');
            // console.log('EQUALS')
            console.log(currentUser.rating.looks.total);
            console.log(currentUser.rating.looks.count);
            // console.log(currentUser.rating.looks.avg + choices[rand2 <= 25 ? '0' : rand2 > 50 ? '1' : '2']);
            currentUser.rating.looks.avg = Math.floor(currentUser.rating.looks.total / currentUser.rating.looks.count);
            currentUser.rating.looks.metricsByAge.get(users[i].age ? users[i].age.toString() : '29') ?
                currentUser.rating.looks.metricsByAge.set(users[i].age ? users[i].age.toString() : '29', {total: currentUser.rating.looks.metricsByAge.get(users[i].age ? users[i].age.toString() : '29').total  + Math.floor(currentUser.rating.looks.avg) + choices[rand2 <= 25 ? '0' : rand2 > 50 ? '1' : '2'], count: currentUser.rating.looks.metricsByAge.get(users[i].age ? users[i].age.toString() : '29').count + 1 })
                : currentUser.rating.looks.metricsByAge.set(users[i].age ? users[i].age.toString() : '29', {total: currentUser.rating.looks.avg + choices[rand2 <= 25 ? '0' : rand2 > 50 ? '1' : '2'], count: 1});
                   await currentUser.save();
        }

    };
    // seedThemTrivia();
};

//seed coordinates so I can use algorithm to find distance between users

const showResource = async function () {
    await database();
    const users = await User.find({})
        .then(data => { return data }).catch(err => console.log(err));
    // console.log(Object.fromEntries(users[2].connections)['64811cb221c21a50a0ee5ae5']);
    console.log(users[1].connections.get('64811cb221c21a50a0ee5ae5'));
    console.log(users.map(user => { return { id: user._id, name: user.name, connections: user.connections } }));
};

const seedLoc = async () => {
    await database();
    const allUsers = await User.find({});
    allUsers.forEach(async (user, index) => {
        const randCoord = Math.floor(Math.random() * 5);
        user.location.geo.coordinates = coords[randCoord] || [-122.257935, 47.784021];
        user.hobbies = [hobbies[index], hobbies[index + 1], hobbies[index + 2], hobbies[index + 3], hobbies[index + 4], hobbies[index + 5]]
        await user.save();
    })
};

const seedSocketUser = async () => {
    await database();
    const socketUser = await User.findById('649f01847167490c3d622445');
    const currentUser = await User.findById('64811cb221c21a50a0ee5ae5');
    currentUser.connections.set('649f01847167490c3d622445', {
        id: '649f01847167490c3d622445', status: 'reciprocated', conversation: [], trivia: {
            me: false,
            them: [
                {
                    question: 'What kind of music do you enjoy?',
                    answer: 'Pop'
                },
                {
                    question: 'What is your favorite movie genre?',
                    answer: 'Action'
                },
                {
                    question: 'Are you an early bird or a night owl?',
                    answer: 'Early bird'
                },
                {
                    question: 'What is your favorite movie genre?',
                    answer: 'Action'
                },
                {
                    question: 'Do you prefer coffee or tea?',
                    answer: 'Coffee'
                }
            ]
        }, review: {}
    });

    socketUser.connections.set('64811cb221c21a50a0ee5ae5', {
        id: '64811cb221c21a50a0ee5ae5', status: 'reciprocated', conversation: [], trivia: {
            them: false,
            me: [
                {
                    question: 'What kind of music do you enjoy?',
                    answers: ['Pop', 'Rock', 'Country', 'Rap'],
                    chosen: 'Pop'
                },
                {
                    question: 'What is your favorite movie genre?',
                    answers: ['Action', 'Comedy', 'Drama', 'Horror'],
                    chosen: 'Action'
                },
                {
                    question: 'Are you an early bird or a night owl?',
                    answers: ['Early bird', 'Night owl', 'Neither', 'Both'],
                    chosen: 'Early bird'
                },
                {
                    question: 'What is your favorite season?',
                    answers: ['Summer', 'Winter', 'Spring', 'Fall'],
                    chosen: 'Summer'
                },
                {
                    question: 'Do you prefer coffee or tea?',
                    answers: ['Coffee', 'Tea', 'Neither', 'Both'],
                    chosen: 'Coffee'
                },
                {
                    question: 'Do you prefer forest or beack?',
                    answers: ['Forest', 'Beach', 'Neither', 'Both'],
                    chosen: 'Beach'
                }
            ]
        }, review: {}
    });
    await currentUser.save();
    await socketUser.save();
};

const populatePending = async () => {
    await database();
    // const currentConnection = await Connection.findById("64ef77dc767dc5b2675e7748");
    // currentConnection.date.shown.bothShown = true;

    // await currentConnection.save();
    // const allUsers = await User.find({});
    // allUsers.forEach(async (user, index) => {
    //     await user.save();
    // })
    // console.log('DONE!')
    // const test = await User.findById("64f0a36ed5d85f1e060c516f");
    // console.log(test);
   
    // const allConnections = await Connection.find({});
    // for (let i = 0; i < allConnections.length; i++){
    //     console.log(allConnections[i].conversation.length);
    //     allConnections[i].conversation = [
    //                     {
    //                         text: "Hello! 😊",
    //                         sender: allConnections[i].connection1.id,
    //                         receiver: allConnections[i].connection2.id,
    //                         date: new Date(),
    //                         connection: allConnections[i]._id
    //                     },
    //                     {
    //                         text:   "Hi there! How's your day going?",
    //                         sender: allConnections[i].connection2.id,
    //                         receiver: allConnections[i].connection1.id,
    //                         date: new Date(),
    //                         connection: allConnections[i]._id
    //                     },
    //                     {
    //                         text:  "Pretty good, thanks for asking! I was just checking out your profile. You seem really interesting. Do you enjoy hiking?",
    //                         sender: allConnections[i].connection1.id,
    //                         receiver: allConnections[i].connection2.id,
    //                         date: new Date(),
    //                         connection: allConnections[i]._id
    //                     },
    //                     {
    //                         text:   "Thanks! Yes, I absolutely love hiking. It's one of my favorite activities. Did you see the pictures from my last hike in my profile?",
    //                         sender: allConnections[i].connection2.id,
    //                         receiver: allConnections[i].connection1.id,
    //                         date: new Date(),
    //                         connection: allConnections[i]._id
    //                     },
    //                     {
    //                         text: "Yes, the scenery looked amazing! I'd love to visit that place sometime. By the way, do you have any other hobbies?",
    //                         sender: allConnections[i].connection1.id,
    //                         receiver: allConnections[i].connection2.id,
    //                         date: new Date(),
    //                         connection: allConnections[i]._id
    //                     },
    //                     {
    //                         text:  "I do! Besides hiking, I enjoy reading, playing the guitar, and traveling. How about you? Tell me more about yourself!",
    //                         sender: allConnections[i].connection2.id,
    //                         receiver: allConnections[i].connection1.id,
    //                         date: new Date(),
    //                         connection: allConnections[i]._id
    //                     }
    //     ];
    //     await allConnections[i].save();
    // }
    const jenny = await User.findOne({ username: 'SuperJenny' });
    console.log(jenny.interestAndPass.byTotal);
    // currentUser.membership.membershipType = 'basic';
    // await currentUser.save();
    // console.log(currentUser.interestAndPass);
    // console.log(currentUser.interestAndPass.byTotal);
    // currentUser.membership.membershipType = 'pro';
    // await currentUser.save();
    // await sortFunction(currentUser._id).then(data => { console.log(data.map(x => x.name)) }).catch(err => console.log(err));
    // console.log(currentUser.membershipType);
    // const currentConnection = await Connection.findById("64e6343960d64b74d51ee28c");
    
    // currentConnection.date.invite.accepted = true;
    // currentConnection.date.shown.bothShown = true;
    // currentConnection.date.review = { connection1: {}, connection2: {} };
    // await currentConnection.save();
    // console.log(currentConnection);
    // currentUser.connections.pending = currentUser.connections.pending.slice(0, 30);
    // await currentUser.save();
}

const seedMetricChanges = async () => {
    await database();
    const currentUser = await User.findOne({ username: "Powerman5000" });
    console.log("BEFORE");
    console.log(currentUser.rating.weekly);
    console.log(currentUser.connections.weekly)

    const currentWeek = 37;
    currentUser.rating.looks.avg = Math.floor(Math.random() * 7 + 3);
    currentUser.rating.date.avg = Math.floor(Math.random() * 7 + 3);
    const totalInteractedWith = currentUser.connections.pending.length + currentUser.connections.matched.length + currentUser.connections.rejectedBy.length;
    const totalLikedByPercentage = 49;
    if (currentWeek !== currentUser.membership.week) {
        currentUser.membership.week = currentWeek;
        if (currentUser.rating.weekly.currentWeek.looks.rating !== currentUser.rating.looks.avg) {
            if (currentUser.rating.weekly.currentWeek.looks.rating > currentUser.rating.looks.avg) {
                currentUser.rating.weekly.currentWeek.looks.trend = 'down';
            } else {
              currentUser.rating.weekly.currentWeek.looks.trend = 'up';
            }
            currentUser.rating.weekly.lastWeek.looks.rating = currentUser.rating.weekly.currentWeek.looks.rating;
            currentUser.rating.weekly.currentWeek.looks.rating = currentUser.rating.looks.avg;
        } else {
            if (currentUser.rating.weekly.currentWeek.looks.trend !== 'none') {
                currentUser.rating.weekly.currentWeek.looks.trend = 'none';
            }
        }
        if (currentUser.rating.weekly.currentWeek.date.rating !== currentUser.rating.date.avg) {
            if (currentUser.rating.weekly.currentWeek.date.rating > currentUser.rating.date.avg) {
                currentUser.rating.weekly.currentWeek.date.trend = 'down';
            } else {
              currentUser.rating.weekly.currentWeek.date.trend = 'up';
            }
            currentUser.rating.weekly.lastWeek.date.rating = currentUser.rating.weekly.currentWeek.date.rating;
            currentUser.rating.weekly.currentWeek.date.rating = currentUser.rating.date.avg;
        } else {
            if (currentUser.rating.weekly.currentWeek.date.trend !== 'none') {
                currentUser.rating.weekly.currentWeek.date.trend = 'none';
            }
        };
        if (currentUser.connections.weekly.currentWeek.likedPercentage !== totalLikedByPercentage) {
            if (currentUser.connections.weekly.currentWeek.likedPercentage > totalLikedByPercentage) {
                currentUser.connections.weekly.currentWeek.trend = 'down';
            } else {
              currentUser.connections.weekly.currentWeek.trend = 'up';
            };
            currentUser.connections.weekly.lastWeek.likedPercentage = currentUser.connections.weekly.currentWeek.likedPercentage;
            currentUser.connections.weekly.currentWeek.likedPercentage = totalLikedByPercentage;
        } else {
            if (currentUser.connections.weekly.currentWeek.trend !== 'none') {
                currentUser.connections.weekly.currentWeek.trend = 'none';
            }
        };
    };
    console.log("AFTER");
    console.log(currentUser.rating.weekly);
    console.log(currentUser.connections.weekly)
    await currentUser.save();
};



// seedMetricChanges();
populatePending();
// sortingCheck();
// seedUser();
// seedConnections();
// seedSocketUser();
// showResource();
// seedLoc();
// seedThemTrivia();


// change it so that compatibility results show up based on calculatePersonality function on match
// no more trivia
