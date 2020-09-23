const functions = require('firebase-functions');
const express = require('express');
const cors = require('cors');

const admin = require('firebase-admin');
admin.initializeApp();

const app = express();

app.use(cors({
    origin: ["http://localhost:5000"]
}));

/* app.options('*', cors()); */
/* app.use(cors({
    origin: true
})); */

app.get('/', async (req, res) => {
    const snapshot = await admin.firestore().collection('messages').get();

    let messages = [];
    snapshot.forEach(doc => {
        let id = doc.id;
        let data = doc.data();

        messages.push({
            id,
            ...data
        });

    });
    res.status(200).send(JSON.stringify(messages));

});

app.get("/:id", async (req, res) => {
    const snapshot = await admin.firestore().collection('messages').doc(req.params.id).get();
    const messagesId = snapshot.id;
    const messagesData = snapshot.data();

    res.status(200).send(JSON.stringify({
        id: messagesId,
        ...messagesData
    }));


})


app.post('/', async (req, res) => {
    const messages = req.body;

    await admin.firestore().collection('messages').add(messages);

    res.status(201).send();
});

app.put("/:id", async (req, res) => {
    const body = req.body;
    await admin.firestore().collection('messages').doc(req.params.id).update({
        ...body
    });

    res.status(200).send()

});

app.delete("/:id", async (request, response) => {
    const userId = request.params.id;
    const userCollectionRef = db.collection("messages");
    const result = await userCollectionRef.doc(userId).delete();

    response.status(200).send(result);
});

exports.messages = functions.https.onRequest(app);