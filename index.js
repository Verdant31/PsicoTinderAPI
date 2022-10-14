var express = require('express');
var bodyParser = require('body-parser')

var webdriver = require('selenium-webdriver');
var chrome = require('selenium-webdriver/chrome');
var path = require('chromedriver').path;
const {By, until} = require('selenium-webdriver');

let options = new chrome.Options();
options.addArguments("--headless");
options.addArguments("--disable-gpu");
options.addArguments("--no-sandbox");


const app = express()
app.use(bodyParser.json())

app.listen(process.env.PORT || 5000), () => {
    console.log("App rodando")
}

app.get('/', (req, res) => {
    return res.send('Hello World!')
})

app.post('/cpf', async (req, res) => {
    let driver = new webdriver.Builder()
        .forBrowser('chrome')
        .setChromeOptions(options)
        .build();
    const { cpf } = req.body; 
    let user = {};
    try {
        await driver.get('https://cadastro.cfp.org.br');
        driver.findElement(By.className("btn btn-secondary btn-lg text-uppercase form-group js-botao-refinar-resultados")).click();
         setTimeout(async () => {
            driver.findElement(By.id("cpf")).sendKeys(cpf);
            driver.findElement(By.className("btn btn-primary btn-lg text-uppercase mr-2 mr-sm-0 form-group")).click();
        },500)
        await driver.wait(until.elementLocated(By.className('table-responsive'))).then(async ()=>{
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
    } finally {
        driver.quit();
    }
})


