const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const csv = require('csvtojson');

const app = express();
const port = 3000;

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

/* Nastavuje adresu tzv. statických souborů */
app.use(express.static('public'));

const urlencodedParser = bodyParser.urlencoded({
    extended: false
});

app.post('/save', urlencodedParser, (req, res) => {
    let jmeno = req.body.name;
    let prijmeni = req.body.surname;
    let mnozstviVody = req.body.water;
    let vek = req.body.age;
    let date = new Date();
    let str = `${jmeno},${prijmeni},${mnozstviVody},${vek}\n`;
    fs.appendFile('./results/result.csv', str, function(err) {
        if (err) {
            console.error(err);
            return res.status(400).json({
                success: false,
                message: 'Byla zjištěna chyba při zápisu do souboru'
            });
        }
    });
    res.redirect(301, '/');
});

app.get('/results', (req, res) => {
    csv().fromFile('./results/result.csv')
        .then(data => {
            console.log(data);
            res.render('results.pug', {
                'players': data,
                'nadpis': 'Tabulka'
            });
        })
        .catch(err => {
            console.log(err);
        })
});


/* Spuštění web serveru, který naslouchá na portu 3000 */
app.listen(port, () => {
    console.log(`Server funguje na portu ${port}`);
});