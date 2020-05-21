import { firestore } from "firebase";

class Payment {
    title: String;
    deadline: Date;
    amount: Number;
    users: Array<String>;
    description: String;
    completed: Boolean;
    photo: String;
    id: firestore.Timestamp;
    constructor(title: String, deadline: Date, amount: Number, users: Array<String>, description: String, completed: Boolean, photo: String, id: firestore.Timestamp) {
        this.title = title;
        this.deadline = deadline;
        this.amount = amount;
        this.users = users
        this.description = description
        this.completed = completed
        this.photo = photo
        this.id = id
    }
    toHistory(author: String, completed: Boolean) {
        if (this.id === null) {
            this.id = firestore.Timestamp.fromDate(new Date())
        }
        var historyItem = {
            "Author": author,
            "Completed": completed,
            "Item ID": this.id,
            "Timestamp": firestore.Timestamp.fromDate(new Date())
        }
        return historyItem
    }
    toFirestore() {
        var firestoreData = Object.create(null)
        if (this.title !== null && this.title !== "") {
            firestoreData["Payment Title"] = this.title
        }
        if (this.deadline !== null) {
            firestoreData["Payment Deadline"] = this.deadline
        }
        if (this.amount !== null && this.amount > 0) {
            firestoreData["Payment Amount"] = this.amount.toFixed(2)
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
        firestoreData["Completed"] = this.completed

        if (this.id === null) {
            this.id = firestore.Timestamp.fromDate(new Date())
        }
        firestoreData["Timestamp"] = this.id

        return firestoreData
    }
}

export default Payment 
