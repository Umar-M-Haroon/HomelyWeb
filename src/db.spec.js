// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
// import firebase from 'firebase/testing';
// import firebaseServiceAccountKey from './firebaseServiceAccountKey.json';

// firebase.initializeApp({
//     projectId: "homely-47bc5",
//     auth: { uid: "Alice", email: "test@email.com" }
// })

// export default firebaseAdmin
// import 'firebase/testing';
const admin = require('firebase-admin')
const firebase = require('@firebase/testing')
const fs = require('fs')
const userID2 = "9cN3l0x3NoQY95dx7zE3nJI4z0613"

describe('Data Controller', () => {
    let db;
    let app;
    beforeAll(async () => {
        const projectId = `homely-47bc5`
        console.log("beforeAll");
        app = firebase.initializeTestApp({
            projectId,
            auth: { "uid": userID2, "email": "test@email.com" }
        })
        db = app.firestore()
        await firebase.loadFirestoreRules({
            projectId,
            "rules": fs.readFileSync('./firestore.rules', 'utf8')
        })
        db.settings({
            host: "localhost:8080",
            ssl: false
        })
    })
    describe('User access', () => {
        test('Grant Access', async () => {
            console.log("This test should cause the user to have access")
            return firebase.assertSucceeds(app.firestore().collection("Homes").doc("TESTHOME").get())
        })
    })
    afterAll(async () => {
        Promise.all(firebase.apps().map(app => app.delete()))
    })
})

    // describe('User access', () => {
    //     test('Test List', async () => {
    //         console.log("This test should cause the user no access")
    //         console.log(db.collection("Homes").get('TESTHOME'))
    //         return db.collection("Homes").get('TESTHOME').then(data => {
    //             expect.anything()
    //         })
    //     })
    // })
    // describe('User access', () => {
    //     test('Test Complete Item', async () => {
    //         console.log("This test should cause the user no access")
    //         console.log(db.collection("Homes").get('TESTHOME'))
    //         return db.collection("Homes").get('TESTHOME').then(data => {
    //             expect.anything()
    //         })
    //     })
    // })
    // describe('User access', () => {
    //     test('Grant Access', async () => {
    //         console.log("This test should cause the user no access")
    //         console.log(db.collection("Homes").get('TESTHOME'))
    //         return db.collection("Homes").get('TESTHOME').then(data => {
    //             expect.anything()
    //         })
    //     })
    // })
    // describe('User access', () => {
    //     test('Test Item', async () => {
    //         console.log("This test should cause the user no access")
    //         console.log(db.collection("Homes").get('TESTHOME'))
    //         return db.collection("Homes").get('TESTHOME').then(data => {
    //             expect.anything()
    //         })
    //     })
    // })
// })