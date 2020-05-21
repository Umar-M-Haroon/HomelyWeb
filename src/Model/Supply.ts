import { firestore } from "firebase";

class Supply {
    title: String;
    amount: Number;
    description: String;
    completed: Boolean;
    photo: String;
    id: firestore.Timestamp;
    constructor(title: String, amount: Number, description: String, completed: Boolean, photo: String, id: firestore.Timestamp) {
        this.title = title
        this.amount = amount
        this.completed = completed
        this.photo = photo
        this.id = id
        this.description = description
    }
    toHistory(author: String, completed: Boolean) {
        if (this.id === null) {
            this.id = firestore.Timestamp.fromDate(new Date())
        }
        var historyItem = Object.create(null)
        historyItem.Author = author;
        historyItem.Completed = completed
        historyItem.Timestamp = firestore.Timestamp.fromDate(new Date())
        historyItem["Item ID"] = this.id
        return historyItem
    }
    toFirestore() {
        var firestoreData = Object.create(null)
        if (this.title !== null && this.title !== "") {
            firestoreData["Supply Title"] = this.title
        }
        if (this.amount !== null && this.amount > 0) {
            firestoreData["Supply Amount"] = this.amount.toFixed(2);
        }
        if (this.photo !== null && this.photo !== "") {
            firestoreData["Image Link"] = this.photo
        }

        if (this.description !== null && this.description !== "") {
            firestoreData["Supply Description"] = this.description
        }

        if (this.id === null) {
            this.id = firestore.Timestamp.fromDate(new Date())
        }


        firestoreData.Completed = this.completed

        firestoreData.Timestamp = this.id
        firestoreData.Preset = false
        return firestoreData
    }
}

export default Supply
