import { firestore } from "firebase"

class Payment {
    constructor(title, deadline, amount, users, description, completed, photo, id) {
        this.title = title
        this.deadline = deadline
        this.amount = parseFloat(amount).toFixed(2)
        this.users = users
        this.description = description
        this.completed = completed
        this.photo = photo
        this.id = id
    }
    toHistory(author, completed) {
        if (this.id === null) {
            this.id = firestore.Timestamp.fromDate(new Date())
        }
        var historyItem = {}
        historyItem.Author = author;
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
            firestoreData["Payment Amount"] = Number(this.amount)
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

export default Payment 
