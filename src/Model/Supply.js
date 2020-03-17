import { firestore, auth } from "firebase"

class Supply {
    constructor(title, amount, description, completed, photo, id) {
        this.title = title
        this.amount = amount
        this.completed = completed
        this.photo = photo
        this.id = id
        this.description = description
    }
    toHistory(author, completed) {
        if (this.id === null){
            this.id = firestore.Timestamp.fromDate(new Date())
        }
        var historyItem = {}
        historyItem.Author = author;
        historyItem.Completed = completed
        historyItem.Timestamp = firestore.Timestamp.fromDate(new Date())
        historyItem["Item ID"] = this.id
        return historyItem
    }
    toFirestore() {
        var firestoreData = {}
        if (this.title !== null && this.title !== "") {
            firestoreData["Supply Title"] = this.title
        }
        if (this.amount !== null && this.amount > 0) {
            firestoreData["Supply Amount"] = Number(parseFloat(this.amount).toFixed(2))
        }
        if (this.photo !== null && this.photo !== "") {
            firestoreData["Image Link"] = this.photo
        }

        if (this.description !== null && this.description !== "") {
            firestoreData["Payment Description"] = this.description
        }

        if (this.id === null) {
            this.id = firestore.Timestamp.fromDate(new Date())
        }


        firestoreData.Completed = this.completed

        firestoreData.Timestamp = this.id
        firestoreData.Preset = false
        this.toHistory()
        return firestoreData 
    }
}

export default Supply
