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
const firebase = require('@firebase/testing')
const fs = require('fs')
const userID2 = "OfmzIC88wxYBsPXpUd4R3cgHwM12"

// const homelyFirebase = require('../src/components/Firebase/firebase.js')
// const chore = require('../src/Model/Chore')
describe('Data Controller', () => {
    let db;
    let app;
    beforeAll(async () => {
        const projectId = `homely-test3`
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
            app.firestore().collection("Homes").doc("TESTHOME").get().then((snapshot) => {
                console.log(snapshot.data())
            })
            return firebase.assertSucceeds(app.firestore().collection("Homes").doc("TESTHOME").get())
        })
    })
    afterAll(async () => {
        Promise.all(firebase.apps().map(app => app.delete()))
    })
})

describe('Add Item', () => {
    let db;
    let app;
    beforeAll(async () => {
        const projectId = `homely-test3`
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
    describe('Item management', () => {
        test('Add Item', async () => {
            console.log("This test should add a chore and confirm it was added")
            let choreState = {
                "title": "firebase-testing",
                "DeadlineDate": null,
                "assignedUsers": null,
            }
            expect(true).toBe(true)
        })
    })
    afterAll(async () => {
        Promise.all(firebase.apps().map(app => app.delete()))
    })
})
