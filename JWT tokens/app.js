const http = require('http')
const express = require('express')
const jwt = require('jsonwebtoken')

const app = express()

// midleware cors
app.use((req,res,next)=>{
    res.setHeader('Access-Control-Allow-Origin', '*'); // Puedes cambiar '*' por un dominio específico

    // Configura los métodos HTTP permitidos
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  
    // Configura las cabeceras personalizadas permitidas
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
    // Habilita las credenciales (cookies y encabezados personalizados) si es necesario
    res.setHeader('Access-Control-Allow-Credentials', 'true');
  
    // Continuar con la solicitud
    next();
})

app.get("/",(req,res)=>{

    res.send("Hola bienvenido a json web tokens")
})

app.get("/api/auth0/",(req,res)=>{
    let payloadUser = {userid:2,username:"Daniel"}
    let userToken = jwt.sign(payloadUser,"12345",{expiresIn:60})
    res.status(200).json({token:userToken})
})

app.get("/api/notes/",(req,res)=>{
    
    // if( !req.body === undefined && req.body.hasOwnProperty("token")) res.send("se encuentra el token")
    const token = req.headers.authorization.split(" ")[1]


    try {
        // verifica el token es valido
        const tokendecode =  jwt.verify(token,"12345")
        console.log("token decode",tokendecode)
    } catch (error) {
        console.log("Token invalido es malo o expiro")
        return res.send("Token ivalido expiro o esta dañado")
    }
    
    // despues de validar si el token es valido respondemos 
    return res.send("your notes")
    
})


app.get("/prueba",(req,res)=>{

    res.status(500).json({error:"Error en el servidor"})
})


const server = new http.createServer(app)


const port = process.env.PORT || 3000



server.listen(port,()=>{
    console.log(` Servidor on http://localhost:${port} `)
})