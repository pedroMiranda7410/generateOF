const user = require('./user.json');
const passwords = require('./passwords.json');
const negotials = require('./negotials.json');
var Excel = require('exceljs');
const puppeteer = require('puppeteer');
let baseXLS = user.hermesXLS;
let userHermes = user.userHermes;
let passHermes = passwords.hermes;

async function readXLS() {

    //Carregando as informações da planilha
    let workbook = new Excel.Workbook();
    await workbook.xlsx.readFile(baseXLS);
    let worksheet = workbook.getWorksheet("Orçamento");

    //Carregando a página do Hermes
    var delayTyping = 50;
    var delayFastNetwork = 1000;
    var delayMedNetwork = 1000;

    const browser = await puppeteer.launch({
        ignoreHTTPSErrors: true,
        slowMo: delayTyping,
        headless: false,
    });

    const pageGenti = await browser.newPage();
    await pageGenti.goto('https://hermes.stefanini.com.br/auth/realms/hermes_prod/protocol/openid-connect/auth?client_id=hermes-frontend&redirect_uri=https%3A%2F%2Fhermes.stefanini.com.br%2Ffuncionario&state=93d3ba14-8838-4b6f-8576-2333619a45ba&response_mode=fragment&response_type=code&scope=openid&nonce=cb6ffef1-0dc2-4a7c-9c0e-8f1b087b0d7d');
    await pageGenti.type('#username', userHermes);
    await pageGenti.type('#password', passHermes);
    await pageGenti.click('#kc-login', { delay: delayMedNetwork });
    await pageGenti.goto('https://hermes.stefanini.com.br/ordem-faturamento/minhas-ofs');

    var selector = 'button[tooltipposition=top]';
    await pageGenti.waitForSelector(selector);
    await pageGenti.click(selector, { delay: delayMedNetwork });

    //Carregando a página do Hermes
    for (var i = 0; i < 50; i++) {

        let row = worksheet.getRow(i);

        if (row.getCell(3).value != null && row.getCell(3).value != "") {

            var disciplina = row.getCell(3).value;
            var atividade = row.getCell(4).value;
            var artefato = row.getCell(5).value;
            var complexidade = row.getCell(7).value;
            var componente = row.getCell(8).value;
            var arquivos = row.getCell(12).value.split("\t");

            if (disciplina && disciplina != "" && disciplina != null) {

                disciplina = negotials.checkSpacesInStrings(disciplina);
                atividade = negotials.checkSpacesInStrings(atividade);
                artefato = negotials.checkSpacesInStrings(artefato);

                if (atividade == "Plataforma Distribuída")
                    atividade = "Plataforma Distribuída ";

                if (atividade == "Tarefas correlacionadas à Implementação")
                    atividade = "Tarefas correlacionadas à Implementação ";

                if (artefato == "Alteração de Objetos de Integração e Negócio Java")
                    artefato = "Alteração de Objetos de Integração e Negócio Java ";

                if (artefato == "Criação CSS ou SCSS")
                    artefato = "Criação CSS ou SCSS ";

                if (artefato == "Alteração CSS ou SCSS")
                    artefato = "Alteração CSS ou SCSS ";

                if (atividade == "Software de Infraestrutura")
                    atividade = "Software de Infraestrutura ";

                selector = 'button[icon="pi pi-plus"]';
                await pageGenti.waitForSelector(selector);
                await pageGenti.click(selector, { delay: delayMedNetwork });

                selector = 'p-dropdown[placeholder="Disciplina"]';
                await pageGenti.waitForSelector(selector);
                await pageGenti.click(selector, { delay: delayMedNetwork });
                selector = 'li[aria-label="' + disciplina + '"]';
                await pageGenti.click(selector, { delay: delayMedNetwork });

                selector = 'p-dropdown[placeholder="Atividade"]';
                await pageGenti.click(selector, { delay: delayFastNetwork });
                selector = 'li[aria-label="' + atividade + '"]';
                await pageGenti.click(selector, { delay: delayMedNetwork });

                selector = 'p-dropdown[placeholder="Descrição/Artefato"]';
                await pageGenti.click(selector, { delay: delayFastNetwork });
                selector = 'li[aria-label="' + artefato + '"]';
                await pageGenti.click(selector, { delay: delayMedNetwork });

                selector = 'p-dropdown[placeholder="Complexidade"]';
                await pageGenti.click(selector, { delay: delayFastNetwork });
                selector = 'li[aria-label="' + complexidade + '"]';
                await pageGenti.click(selector, { delay: delayMedNetwork });

                selector = 'p-dropdown[placeholder="Componente/Item"]';
                await pageGenti.click(selector, { delay: delayFastNetwork });
                selector = 'li[aria-label="' + componente + '"]';
                await pageGenti.click(selector, { delay: delayMedNetwork });

                selector = 'textarea[rows="7"]';
                await pageGenti.type(selector, arquivos);
                pageGenti.keyboard.press('Enter');

                selector = 'button[style="margin-top: 23px; height: 86%;"]';
                await pageGenti.click(selector, { delay: delayFastNetwork });

                selector = 'button[label="GRAVAR"]';
                await pageGenti.click(selector, { delay: delayFastNetwork });

                await pageGenti.reload();
            }

        }

    }

    await pageGenti.close();
    await browser.close();

}

readXLS();