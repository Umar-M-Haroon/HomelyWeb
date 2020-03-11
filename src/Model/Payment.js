import { firestore, auth } from "firebase"

class Payment {
    constructor(title, deadline, amount, users, description, completed, photo, id) {
        this.title = title
        this.deadline = deadline
        this.amount = amount
        this.users = users
        this.description = description
        this.completed = completed
        this.photo = photo
        this.id = id
    }
    toHistory(completed) {
        if (this.id === null) {
            this.id = firestore.Timestamp.fromDate(new Date())
        }
        var historyItem = {}
        historyItem.Author = auth.currentUser.uid;
        historyItem.Completed = completed
        historyItem["Item ID"] = this.id
        historyItem.Timestamp = firestore.Timestamp.fromDate(new Date())
        return historyItem
    }
    toFirestore() {
        var firestoreData = {}
        if (this.title !== null && this.title !== "") {
            firestoreData["Payment Title"] = this.title
        }
        if (this.deadline !== null) {
            firestoreData["Payment Deadline"] = this.deadline
        }
        if (this.amount !== null && this.amount > 0) {
            firestoreData["Payment Amount"] = this.amount
        }
        if (this.users !== null && this.users !== []) {
            firestoreData["Assigned Users"] = this.users
        }
        if (this.photo !== null && this.photo !== "") {
            firestoreData["Image Link"] = this.photo
        }
        if (this.description !== null && this.description !== "") {
            firestoreData["Payment Description"] = this.description
        }
        firestoreData.Completed = this.completed

        if (this.id === null) {
            this.id = firestore.Timestamp.fromDate(new Date())
        }
        firestoreData.Timestamp = this.id

        return firestoreData
    }
}

const paymentConverter = {
    toFirestore: function (payment) {
        var firestoreData = {}
        if (payment.title !== null && payment.title !== "") {
            firestoreData["Payment Title"] = payment.title
        }
        if (payment.deadline !== null) {
            firestoreData["Payment Deadline"] = payment.deadline
        }
        if (payment.amount !== null && payment.amount > 0) {
            firestoreData["Payment Amount"] = payment.amount
        }
        if (payment.users !== null && payment.users !== []) {
            firestoreData["Assigned Users"] = payment.users
        }
        if (payment.photo !== null && payment.photo !== "") {
            firestoreData["Image Link"] = payment.photo
        }
        if (payment.description !== null && payment.description !== "") {
            firestoreData["Payment Description"] = payment.description
        }
        firestoreData.Completed = payment.completed

        if (payment.id === null) {
            payment.id = firestore.Timestamp.fromDate(new Date())
        }
        firestoreData.Timestamp = payment.id

        return firestoreData

    }, fromFirestore: function snapshot(options) {
        const data = snapshot.data(options)
        return new Payment(data["Payment Title"], data["Payment Deadline"].toDate(), data["Payment Amount"], data["Assigned Users"], data["Payment Description"], data.Completed, data["Image Link"], data.Timestamp)
    }
}
var model = { Payment, paymentConverter }
export default Payment 