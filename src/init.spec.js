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
const admin = require('firebase-admin')

const userID = "test"
const userID2 = "9cN3l0x3NoQY95dx7zE3nJI4z0613"

describe('firestore Triggers 1', () => {
    let db;
    beforeAll(async () => {
        console.log("beforeAll")
        db = admin.initializeApp({
            projectId: "homely-47bc5",
            auth: { "uid": "Alice", "email": "test@email.com" }
        }).firestore()
        db.settings({
            host: "localhost:8080",
            ssl: false
        })
    })
    afterAll(async () => {
        console.log("afterAll")
    })
    describe('User Initialization', () => {
        test('Init user', async () => {
            console.log("init the Test")
            expect(db._settings.servicePath).toBe('localhost')
            expect(true).toBe(true)
        })
    })
    describe('User access', () => {
        test('Fail to Access', async () => {
            console.log("This test should cause the user no access")
            console.log(db.collection("Homes").get('TESTHOME'))
            return db.collection("Homes").get('TESTHOME').then(data => {
                expect.anything()
            })
        })
    })
    describe('User access', () => {
        test('Test List', async () => {
            console.log("This test should cause the user no access")
            console.log(db.collection("Homes").get('TESTHOME'))
            return db.collection("Homes").get('TESTHOME').then(data => {
                expect.anything()
            })
        })
    })
    describe('User access', () => {
        test('Test Complete Item', async () => {
            console.log("This test should cause the user no access")
            console.log(db.collection("Homes").get('TESTHOME'))
            return db.collection("Homes").get('TESTHOME').then(data => {
                expect.anything()
            })
        })
    })
    describe('User access', () => {
        test('Grant Access', async () => {
            console.log("This test should cause the user no access")
            console.log(db.collection("Homes").get('TESTHOME'))
            return db.collection("Homes").get('TESTHOME').then(data => {
                expect.anything()
            })
        })
    })
    describe('User access', () => {
        test('Test Item', async () => {
            console.log("This test should cause the user no access")
            console.log(db.collection("Homes").get('TESTHOME'))
            return db.collection("Homes").get('TESTHOME').then(data => {
                expect.anything()
            })
        })
    })
})