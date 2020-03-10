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
    toHistory(completed) {
        if (this.id === null){
            this.id = firestore.Timestamp.fromDate(new Date())
        }
        var historyItem = {}
        historyItem.author = auth.currentUser.uid;
        historyItem.completed = completed
        historyItem.itemID = this.id
        historyItem.Timestamp = firestore.Timestamp.fromDate(new Date())
        return historyItem
    }
    toFirestore() {
        var firestoreData = {}
        if (this.title !== null && this.title !== "") {
            firestoreData["Supply Title"] = this.title
        }
        if (this.amount !== null && this.amount > 0) {
            firestoreData["Supply Amount"] = this.amount
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

const supplyConverter = {
    toFirestore: function (supply) {
        var firestoreData = {}
        if (supply.title !== null && supply.title !== "") {
            firestoreData["Supply Title"] = supply.title
        }
        if (supply.amount !== null && supply.amount > 0) {
            firestoreData["Supply Amount"] = supply.amount
        }
        if (supply.photo !== null && supply.photo !== "") {
            firestoreData["Image Link"] = supply.photo
        }

        if (supply.description !== null && supply.description !== "") {
            firestoreData["Payment Description"] = supply.description
        }

        if (supply.id === null) {
            supply.id = firestore.Timestamp.fromDate(new Date())
        }


        firestoreData.Completed = supply.completed

        firestoreData.Timestamp = supply.id
        firestoreData.Preset = false
        supply.toHistory()
        return firestoreData
    }, fromFirestore: function snapshot(options) {
        const data = snapshot.data(options)
        return new Supply(data["Supply Title"], data["Supply Amount"], data["Supply Description"], data.Completed, data["Image Link"], data.Timestamp)
    }
}

var model = {Supply, supplyConverter}
export default Supply