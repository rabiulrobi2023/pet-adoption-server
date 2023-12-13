// ==============Server Setup==============
const express = require("express")
const app = express()
const cors = require("cors")
const port = process.env.PORT ||5000
require("dotenv").config()
app.use(cors())

// {
//     origin:["https://creative-semolina-b2c9a1.netlify.app"]
// }

app.use(express.json());
// ==============Database Setup==============
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.bta6ici.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {

    try {
        // await client.connect();

        const categoryCollection=client.db("pet-adoption").collection("categories")
        const userCollection=client.db("pet-adoption").collection("users")
        const adoptCollecton=client.db("pet-adoption").collection("adoption")

        app.get("/categories",async(req,res)=>{
            const result= await categoryCollection.find().toArray()
            res.send(result)
        })

        app.post("/users",async(req,res)=>{
            const user=req.body;
            const result= await userCollection.insertOne(user)
            console.log(result)
            res.send(result)
        })

        app.get("/users",async(req,res)=>{
            const result=await userCollection.find().toArray()
            res.send(result)

        })

        app.get("/users/:email",async(req,res)=>{
            const query={userEmail:req.params.email};
            const result= await userCollection.findOne(query);
            res.send(result)          
        })

        app.post("/adoptions",async (req,res)=>{
            const adoptionPet=req.body;
            const result= await adoptCollecton.insertOne(adoptionPet)
            res.send(result)
        })

        app.get("/adoptions",async(req,res)=>{
            const result= await adoptCollecton.find().sort({adoptionDate:-1}).toArray()
            res.send(result)

        })

        app.get("/adoptions/:id", async(req,res)=>{
            const id=req.params.id
            const query={_id: new ObjectId(id)}
            const result= await adoptCollecton.findOne(query)
            res.send(result)
        })

        app.patch("/users/admin/:id",async(req,res)=>{
            const filter={_id: new ObjectId(req.params.id)}
            const updatedDoc={
                $set:{
                    role:"admin"
                }
            }
            const result=await userCollection.updateOne(filter,updatedDoc)
            res.send(result)
        })
        app.patch("/admin/remove/:id",async(req,res)=>{
            const filter={_id: new ObjectId(req.params.id)}
            const updatedDoc={
                $set:{
                    role:"user"
                }
            }
            const result=await userCollection.updateOne(filter,updatedDoc)
            res.send(result)
        })


        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    }
    
  
    finally {

        // await client.close();
    }
}


run().catch(console.dir);

app.get("/", (req, res) => {
    res.send("Pet Adoption Server Is Running")
})
app.listen(port, () => {
    console.log(`Pet Adoption server is running on port ${port} `)
})