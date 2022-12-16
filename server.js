"use strict";

/* DOTENV */
const path = require('path')
require("dotenv").config({ path: path.resolve(__dirname, 'credentials/.env') })

/* EXPRESS */
const express = require("express")
const app = express()
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended:false}))
app.set("views", path.resolve(__dirname, "views"))
app.set("view engine", "ejs")

/* LOCAL - MONGO */
const databaseAndCollections = {db: "MotivationHub", youtubeCollection:"youtubeVideos", quoteCollection: "collection"}
const { MongoClient, ServerApiVersion } = require('mongodb')
const userName = process.env.MONGO_DB_USERNAME
const password = process.env.MONGO_DB_PASSWORD
const uri = `mongodb+srv://${userName}:${password}@cluster0.zys1wzb.mongodb.net/?retryWrites=true&w=majority`
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 })

/* CORS */
// const cors = require("cors");
// app.use(cors);

/* DEPLOYMENT - MONGO */
// const { MongoClient } = require('mongodb')
// const uri = process.env.MONGO_CONNECTION_STRING
// const client = new MongoClient(uri)


/* EXPRESS ROUTES */
app.get("/", (request, response) => {
    response.render("index");
})

app.get("/showYoutubeVideos", async (request, response) => {
    let youtubeVideos = client.db(databaseAndCollections.db)
                .collection(databaseAndCollections.youtubeCollection)
                .find({})

    let youtubeVideosArray = await youtubeVideos.toArray()
    response.json({youtubeVideos: youtubeVideosArray})
})

app.get("/showYoutubeVideos/:title", async (request, response) => {
    let {title} = request.params
    let filter = {videoName : title}
    let youtubeVideos = client.db(databaseAndCollections.db)
                .collection(databaseAndCollections.youtubeCollection)
                .find(filter)

    let youtubeVideosArray = await youtubeVideos.toArray()
    response.json({youtubeVideos: youtubeVideosArray})
})

app.get("/deleteYoutubeVideo/:id"), (request, response) => {
    console.log("Hey")
    let {id} = request.body
    let filter = {_id: id}

    client.db(databaseAndCollections.db).collection(databaseAndCollections.youtubeCollection).deleteOne(filter).then(r => console.log(r))
}

app.get("/addYoutubeVideo", (request, response) => {
    response.render("addYoutubeVideo")
})

app.post("/addYoutubeVideo", (request, response) => {
    let {videoName, videoURL} = request.body

    const variables = {
        videoName: videoName,
        videoURL: videoURL
    }

    client.db(databaseAndCollections.db).collection(databaseAndCollections.youtubeCollection).insertOne(variables)
    .then(response.render("processYoutubeVideo", variables))
})

app.get("/randomYoutubeVideo", async (request, response) => {

    let randomYoutubeVideo = client.db(databaseAndCollections.db)
                .collection(databaseAndCollections.youtubeCollection)
                .aggregate([{$sample:{size:1}}])

    randomYoutubeVideo = await randomYoutubeVideo.toArray()
    randomYoutubeVideo = randomYoutubeVideo[0]
    let randomYoutubeVideoHTML = `

    <h2> Video Name: ${randomYoutubeVideo.videoName} </h2><br><br>
    <iframe width="1300" height="700" src="${randomYoutubeVideo.videoURL}"></iframe>

    `
    
    let variables = {
        randomType: "Youtube Video",
        randomMotivation: randomYoutubeVideoHTML
    }

    response.render("randomMotivation", variables)
})

app.get("/showQuotes", async (request, response) => {
    var quotesTableHTML = '<table border-style="double" border="1"><tr><th>Quote Author</th><th>Quote</th></tr>'
    let quotes = client.db(databaseAndCollections.db)
                .collection(databaseAndCollections.quoteCollection)
                .find({})

    let quotesArray = await quotes.toArray()
    quotesArray.forEach(quote => 

                quotesTableHTML += 
                `<tr><td>${quote.quoteAuthor}</td>
                <td>${quote.quote}</td></tr>`

    )
    quotesTableHTML += "</table>"

    response.render("showQuotes", {quotesTable: quotesTableHTML})
})

app.get("/addQuote", (request, response) => {
    response.render("addQuote")
})

app.post("/addQuote", (request, response) => {
    let {quoteAuthor, quote} = request.body

    const variables = {
       quoteAuthor: quoteAuthor,
       quote: quote
    }

    client.db(databaseAndCollections.db).collection(databaseAndCollections.quoteCollection).insertOne(variables)
    .then(response.render("processQuote", variables))
})

app.post("/adminRemove", (request, response) => {

    client.connect()
    .then(result => client.db(databaseAndCollection.db).collection(databaseAndCollection.collection).deleteMany({}))
    .then(result => response.render("processAdminRemove", {numberOfApplications: result.deletedCount}))
    .then(client.close())
    .catch(err => console.error(`Fatal error occurred: ${err}`)) 
})


/* EXPRESS SERVER */
const PORT = 3000

async function main() {
    await client.connect()
    .then(app.listen(PORT, () => {
        console.log("listening for requests");
    }))
    .catch(err => {console.error(`Fatal error occurred: ${err}`); return false}) 
}

main()


