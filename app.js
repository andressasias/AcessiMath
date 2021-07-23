const path = require('path')
const express = require('express')

const db = require("./db")

const app = express()

app.use(express.static('src'))

app.get('/', (req, res) => {
    res.sendFile(path.resolve('src/html/index.html'));
})

app.get('/atividades', (req, res) => {
    res.sendFile(path.resolve('src/html/atividades.html'));
})

app.get('/sobre', (req, res) => {
    res.sendFile(path.resolve('src/html/sobre.html'));
})

app.get('/api/atividades/:nivel', async(req, res) => {
    const { params: { nivel } } = req
    const row = await db.selectAtividadeByLevel(nivel)
    res.json(row);
})

app.listen(process.env.PORT || 3000, () => {
    console.log('Ok')
})