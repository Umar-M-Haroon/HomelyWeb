import { firestore } from "firebase"
class Chore {
    constructor(title, deadline, users, completed, id) {
        this.title = title
        this.deadline = deadline
        this.users = users
        this.completed = completed
        this.id = id
        console.log("Created Chore Object")
    }
    toHistory(author, completed) {
        if (this.id === null){
            this.id = firestore.Timestamp.fromDate(new Date())
        }
        var historyItem = {}
        historyItem.author = author;
        historyItem.completed = completed
        historyItem.itemID = this.id
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

        if (this.id === null){
            this.id = firestore.Timestamp.fromDate(new Date())
        }

        firestoreData.Timestamp = this.id

        return firestoreData 
    }
}

const choreConverter = {
    toFirestore: function(chore) {
        var firestoreData = {}
        if (chore.title !== null && chore.title !== "") {
            firestoreData.Title = chore.title
        }
        if (chore.deadline !== null) {
            firestoreData.Deadline = chore.deadline
        }
        if (chore.users !== null && chore.users !== []) {
            firestoreData["Assigned Users"] = chore.users
        }
        firestoreData.Completed = chore.completed

        if (chore.id === null){
            chore.id = firestore.Timestamp.fromDate(new Date())
        }

        firestoreData.Timestamp = chore.id

        return firestoreData

    }, fromFirestore: function snapshot(options) {
       const data = snapshot.data(options)
       return new Chore(data.Title, data.Deadline.toDate(), data["Assigned Users"], data.Completed, data.Timestamp)
    }
}
export default Chore