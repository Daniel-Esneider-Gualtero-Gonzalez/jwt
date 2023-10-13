const http = require('http')
const express = require('express')
// dotenv para cargar las varibales de entorno que utilizare para el proyecto
const dotenv =  require("dotenv").config()
const jwt = require('jsonwebtoken')



const app = express()

app.use(express.json())

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

app.post("/api/auth0/",(req,res)=>{
    console.log("data de user ", req.body)
    const payloadUser =  req.body
    let userToken = jwt.sign(payloadUser,process.env.JWTSECRET,{expiresIn:"1d"})
    res.status(200).json({token:userToken})
})


app.get("/api/auth0/resfrestToken",(req,res)=>{

    const tokenBearer = req.headers.authorization.split(" ")[1]
    let token = null

    if(!tokenBearer) return res.status(400).json({error:"Invalid request" , message: "Falta el token dea cceso a la solicitud"})

    try {
        const verifiToken = jwt.verify(tokenBearer,process.env.JWTSECRET)
        // despues utilizamos el mismo token pero eliminamos la fecha antigua de expiracion
        delete verifiToken.exp

        token = verifiToken
       
    } catch (error) {

        return res.status(401).json({message: "Token expired"})
    }

    
    jwt.sign(token,process.env.JWTSECRET,{expiresIn:"1d"},(err,token)=>{

        if(err) {
            return res.status(500).json({message:"Error al Refrescar el token"})
        }

        return res.status(200).json({token:token})
        
        
    })

    

    
})



app.get("/api/notes/",(req,res)=>{
    
    // if( !req.body === undefined && req.body.hasOwnProperty("token")) res.send("se encuentra el token")
    const token = req.headers.authorization.split(" ")[1]


    try {
        // verifica el token es valido
        const tokendecode =  jwt.verify(token,process.env.JWTSECRET)
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