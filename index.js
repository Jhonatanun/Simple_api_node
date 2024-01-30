import { error } from "console";
import express from "express";
import fs from "fs";
import bodyParser from "body-parser";

const app = express();
app.use(bodyParser.json());

const readData = ()=>{
    try{
        const data = fs.readFileSync("./db.json");
        //console.log(JSON.parse(data)); Con esta linea de codigo muestro los datos de mi db.json por consola
        return JSON.parse(data);
    } catch (error){
        console.log(error);
    };  
};

const writeData = (data)=>{
    try{
        fs.writeFileSync("./db.json", JSON.stringify(data));
    } catch (error){
        console.log(error);
    }; 
};

readData();

app.get("/", (req, res)=>{
    res.send("Bienvenido a mi api que hice con NodeJs")
});

app.get("/users", (req, res)=>{
    const data = readData();
    res.json(data)
});

app.get("/users/:id", (req, res)=>{
    const data = readData();
    const id = parseInt(req.params.id);
    const user = data.users.find((user)=> user.id === id);
    res.json(user);
});

app.post("/users", (req, res) => {
    const data = readData();
    const body = req.body;
    const newUser = {
        id: data.users.length +1,
        ...body
    }
    data.users.push(newUser);
    writeData(data);
    res.json(newUser);
});

app.put("/users/:id", (req, res)=>{
    const data = readData();
    const body = req.body;
    const id = parseInt(req.params.id);
    const userIndex = data.users.findIndex((user)=> user.id === id);

    const userUpdate = data.users[userIndex] = {
        ...data.users[userIndex],
        ...body
    };
    writeData(data);
    res.json(userUpdate);                                                                                                                      
});

app.delete("/users/:id", (req, res)=>{
    const data = readData();
    const id = parseInt(req.params.id);
    const userIndex = data.users.findIndex((user) => user.id === id);
    data.users.splice(userIndex, 1);
    writeData(data);
    res.json({message: "Usuario eliminado"});
});


app.listen(3000, ()=>{
    console.log("Server listening on port 3000")
});