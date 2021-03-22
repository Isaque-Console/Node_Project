const express = require('express')
const app = express()
const { Client } = require('pg');
require('dotenv').config()
const axios = require('axios');

app.use(express.json())

client = new Client({
    host: process.env.HOST,
    user: process.env.DB_USER,
    password: process.env.PASSWORD,
    port: process.env.PORT,
    database: process.env.DATABASE, 
})  
client.connect()

app.get('/',async (req,res) => {
    const responseValue = 'successful get'
    const text = "SELECT * FROM pagamento"
    const cliente = await client.query(text)
    const dados = await axios({
        method: 'get',
        url: 'viacep.com.br/ws/01001000/json/',
        headers: {
            'Content-type': 'application/json'
        }
        // data: {
        //   firstName: 'Fred',
        //   lastName: 'Flintstone'
        // }
    });
    res.send(cliente)
})

app.get('/:id',async (req,res) => {
    const responseValue = 'successful get'
    const id = req.params.id
    const text = "SELECT * FROM pagamento WHERE id=$1"
    const value = [id]
    const cliente = await client.query(text,value)
    res.send(cliente)
})

app.post('/',(req,res) => {
    const responseValue = 'successful post'
    const produto = req.body.produto
    const data = req.body.data
    const desconto = req.body.desconto
    const status = req.body.status
    if(desconto < 100){
        const text = 'INSERT INTO pagamento(produto,data,desconto,status) VALUES($1, $2, $3, $4)'
        const values = [produto,data,desconto,status]
        client.query(text,values)
        res.send(responseValue)
    }
    else {
        res.send('Error: 100% discount')
    }
})

app.put('/:id', (req,res) => {
    const responseValue = 'successful put'
    const produto = req.body.produto
    const data = req.body.data
    const desconto = req.body.desconto
    if(desconto < 100){
    const status = req.body.status
    const id = req.params.id
    const text = 'UPDATE pagamento SET produto=$1, data=$2, desconto=$3, status=$4 WHERE id=$5'
    const values = [produto,data,desconto,status,id]
    client.query(text,values)
    res.send(responseValue)
    }
    else{
        res.send('Error: 100% discount')
    }
})

app.delete('/:id', (req,res) => {
    const responseValue = 'successful delete'
    const id = req.params.id
    const text = 'DELETE FROM pagamento WHERE id=$1'
    const value = [id]
    client.query(text,value)
    res.send(responseValue)
})

//axios.get()

 
 

const port = 3001

app.listen(port, () => {
        console.log('Server alive')   
})