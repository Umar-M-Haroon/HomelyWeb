import { firestore } from "firebase";
class Chore {
    title: String;
    deadline: Date;
    users: Array<String>;
    completed: Boolean;
    id: firestore.Timestamp;

    constructor(title: String, deadline: Date, users: Array<String>, completed: Boolean, id: firestore.Timestamp) {
        this.title = title
        this.deadline = deadline
        this.users = users
        this.completed = completed
        this.id = id
    }
    toHistory(author: String, completed: Boolean) {
        if (this.id === null || this.id === undefined) {
            console.log("HOUSTON WE HAVE A PROBLEMO")
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
            firestoreData["Title"] = this.title
        }
        if (this.deadline !== null) {
            firestoreData["Deadline"] = this.deadline
        }
        if (this.users !== null && this.users !== []) {
            firestoreData["Assigned Users"] = this.users
        }
        firestoreData["Completed"] = this.completed

        if (!this.id) {
            this.id = firestore.Timestamp.fromDate(new Date())
        }

        firestoreData["Timestamp"] = this.id

        return firestoreData
    }
}

export default Chore
