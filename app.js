var http = require('http');
var fs = require('fs');
var url = require('url');

var pathPage = function(page){
      return __dirname + "/src/html/" + page + ".html";
};

var router = function(pathname){
    if(pathname && pathname != "/"){
        var exist = fileExists( pathPage(pathname) );
        return exist ? pathPage(pathname) : pathPage("erro");
    }
    return pathPage("index");
};

var fileExists = function(filePath){
    try{
        return fs.statSync(filePath).isFile();
    }catch (err){
        return false;
    }
};

var server = http.createServer(function (request, response) {
    var page = router( url.parse(request.url).pathname );
    fs.readFile(page, function(err, data){
        response.end(data);
    });
});

server.listen(3000, function () {
    console.log('Servidor rodando na porta 3000');
});



//index.js
(async () => {

    //"pegando" functions que foram exportadas no db.js e colocando em const db
    const db = require("./db");
    console.log("Começou")

    console.log("select das atividades")
    const atividades = await db.selectAtividades();
    console.log(atividades);

    /*
    console.log("insert do cliente");
    const result = await db.insertCustomer({nome: "Zé", idade: 18, uf: "SP"})
    console.log(result);
     console.log("update do cliente");
    const result2 = await db.updateCustomer(4, {nome: "Zé José", idade: 19, uf: "SP"})
    console.log(result2);

    console.log("select dos clientes 2")
    const clientes2 = await db.selectCustomers();
    console.log(clientes2);

    console.log("delete do cliente");
    const result3 = await db.deleteCustomer(4)
    console.log(result3);

    console.log("select dos clientes 2")
    const clientes3 = await db.selectCustomers();
    console.log(clientes3);
    */

  

   

})();