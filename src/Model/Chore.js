import { firestore } from "firebase"
class Chore {
    constructor(title, deadline, users, completed, id) {
        this.title = title
        this.deadline = deadline
        this.users = users
        this.completed = completed
        this.id = id
    }
    toHistory(author, completed) {
        if (this.id === null || this.id === undefined) {
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
            firestoreData.Title = this.title
        }
        if (this.deadline !== null) {
            firestoreData.Deadline = this.deadline
        }
        if (this.users !== null && this.users !== []) {
            firestoreData["Assigned Users"] = this.users
        }
        firestoreData.Completed = this.completed

        if (this.id === null) {
            this.id = firestore.Timestamp.fromDate(new Date())
        }

        firestoreData.Timestamp = this.id

        return firestoreData
    }
}

export default Chore
