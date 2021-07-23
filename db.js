// db.js
async function connect(){
  if(global.connection && global.connection.state !== 'disconnected'){
      return global.connection;
  }
  const mysql = require("mysql2/promise");
  const connection = await mysql.createConnection("mysql://adminacessimath:cadavm0258@mysql742.umbler.com:41890/dbacessimath")
  global.connection = connection;
  return connection;
}

connect();

//select
async function selectAtividades(){
  //estabelece conexão
  const conn = await connect();
  //faz a query e retorna um array das linhas
  const [rows] = await conn.query('SELECT * FROM atividades;');
  return rows;
}

async function selectAtividadeByLevel(nivel){
  //estabelece conexão
  const conn = await connect();
  //faz a query e retorna um array das linhas
  const [rows] = await conn.query(`SELECT * FROM atividades WHERE nivel=${nivel};`);
  return rows;
}

//insert
async function insertCustomer(customer){
  const conn = await connect();
  const sql = 'INSERT INTO clientes(nome, idade, uf) VALUES (?,?,?);';
  const values = [customer.nome, customer.idade, customer.uf];
  return await conn.query(sql, values)
}

//update
async function updateCustomer(id, customer){
  const conn = await connect();
  const sql= 'UPDATE clientes SET nome=?, idade=?, uf=? WHERE id=?;'
  const values = [customer.nome, customer.idade, customer.uf, id];
  return await conn.query(sql, values)
}

//delete
async function deleteCustomer(id){
  const conn = await connect();
  const sql = 'DELETE FROM clientes WHERE id = ?'
  return await conn.query(sql, [id]);
}

//exportando functions
module.exports = {selectAtividades, insertCustomer, updateCustomer, deleteCustomer, selectAtividadeByLevel}