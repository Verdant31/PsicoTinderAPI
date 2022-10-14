var app = require('express');
var webdriver = require('selenium-webdriver');
var chrome = require('selenium-webdriver/chrome');
var path = require('chromedriver').path;
var bodyParser = require('body-parser')
const {Builder, By, Key, until} = require('selenium-webdriver');

const driver = new webdriver.Builder()
    .withCapabilities(webdriver.Capabilities.chrome())
    .build();


const server = app()
server.use(bodyParser.json())

function parseProvince(province) {
    if(province === "Pará") return 14;
}

server.post('/', async (req, res) => {
    const { cpf } = req.body; 
    let user = {};
    try {
        await driver.get('https://cadastro.cfp.org.br');
        driver.findElement(By.className("btn btn-secondary btn-lg text-uppercase form-group js-botao-refinar-resultados")).click();
         setTimeout(async () => {
            driver.findElement(By.id("cpf")).sendKeys(cpf);
            driver.findElement(By.className("btn btn-primary btn-lg text-uppercase mr-2 mr-sm-0 form-group")).click();
        },500)
        await driver.wait(until.elementLocated(By.className('table table-striped table-hover')),10000).then(async ()=>{
            const values = await driver.findElements(By.css("td"));
            const status = await values[0].getText();
            const name = await values[1].getText();
            const province = await values[2].getText();
            const registry = await values[3].getText();
            user = {
                status,
                name,
                province,
                registry
            }
        });
        return res.status(200).json({message: "Usuario encontrado com sucesso.", user})
    } catch(err) {
        return res.status(500).json({message: "Erro ao buscar usuario.", err})
    }
})

server.listen(3001, () => {
    console.log("Server rodando")
})