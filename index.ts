import app from 'express'
import { load } from 'cheerio';
import axios from 'axios';
const server = app()
server.listen(3001, () => {
    console.log("Server rodando")
})

server.get('/', async (req, res) => {
    axios
    const url = 'http://cadastro.cfp.org.br/';
    const response = await axios.get(url);
    const $ = load(response.data);
    
    $('input').each(function( i, element ) {
        if($(element).attr( 'id' )=='nomepsi' ) {
            console.log( $(element).html() );
        }
        console.log( $(element).attr( 'id' ) );
        console.log('hehe')
    } );
})