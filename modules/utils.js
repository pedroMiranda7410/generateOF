const user = require('../user.json');
const userConfig = require('../config/userConfig.json');

var choosenDate = user.choosenDate;
var otherDate = user.otherDate;
let metaPoints = userConfig.metaPoints;

module.exports.checkValidArrayLength = (array) => {

    var count = 0;

    array.forEach(element => {
        if (
            /[a-zA-Z]/.test(element)
            || /[\d]/.test(element)
        ) count++;
    });

    return count;

}

module.exports.getBusinessDatesCount = (startDate, endDate) => {
    let count = 0;
    let curDate = +startDate;
    while (curDate <= +endDate) {
        const dayOfWeek = new Date(curDate).getDay();
        const isWeekend = (dayOfWeek === 6) || (dayOfWeek === 0);
        if (!isWeekend) {
            count++;
        }
        curDate = curDate + 24 * 60 * 60 * 1000
    }
    return count;
}

module.exports.formatDateTerminalReport = (date) => {

    var month = ["JAN", "FEV", "MAR", "ABR", "MAI", "JUN", "JUL", "AGO", "SET", "OUT", "NOV", "DEZ"];

    var a = date.split("-");
    var result = a[2] + "/" + (month[parseInt(a[1]) - 1])

    return result;

}

module.exports.formatDate2TerminalReport = (date) => {

    var month = ["JAN", "FEV", "MAR", "ABR", "MAI", "JUN", "JUL", "AGO", "SET", "OUT", "NOV", "DEZ"];
    var a = date.replace('/', '-').replace('/', '-').split("-");
    var result = a[0] + "/" + (month[parseInt(a[1]) - 1]);
    return result;
}

module.exports.getDayByDate = (date) => {

    var dias = ["DOM", "SEG", "TER", "QUA", "QUI", "SEX", "SAB"];
    return dias[date.getDay()];

}

module.exports.checkSpacesInStrings = (string) => {

    var arrayStrings = [
        "Plataforma Distribuída",
        "Tarefas correlacionadas à Implementação",
        "Alteração de Objetos de Integração e Negócio Java",
        "Criação CSS ou SCSS",
        "Alteração CSS ou SCSS",
        "Software de Infraestrutura"
    ]

    if (arrayStrings.includes(string))
        string = string + " ";

    return string;

}

module.exports.returnSISBBStatus = (diffDays, SISBBPoints) => {

    var percent = (SISBBPoints / metaPoints) * 100;

    //var championChars = [`🎉​`, `🎊`, `​🎖️`, `​🏆`, `​🏅`, `​🥇`, `​⛳`];
    var championChars = [`✅​`];
    var superChars = [`🦸​`]
    var extremelyHappyChars = [`🚀`];
    var veryHappyChars = [`🥳`, `😎`, `😝`, `🤪`, `🥰`, `😍`, `🤩`];
    var happyChars = [`😁`, `😀`, `😊`, `😇`, `🙂`];
    var neutralChars = [`🥲`, `😶`, `😐`, `😅`];
    var almostChars = [`🥺`, `😕`, `😟`];
    var fewSadChars = [`😣`, `😫`, `😩`];
    var sadChars = [`😨`, `😰`, `😓`];
    var verySadChars = [`😭`, `😱`];
    var deadChars = [`💀`];

    var arrChars = [];

    if (percent >= 350) {
        char = superChars[Math.floor(Math.random() * superChars.length)];
    } else if (percent >= 210) {
        char = extremelyHappyChars[Math.floor(Math.random() * extremelyHappyChars.length)];
    } else if (percent >= 136) {
        char = veryHappyChars[Math.floor(Math.random() * veryHappyChars.length)];
    } else if (percent >= 104) {
        char = happyChars[Math.floor(Math.random() * happyChars.length)];
    } else if (percent >= 99) {

        if (diffDays > 1) {
            char = happyChars[Math.floor(Math.random() * happyChars.length)];
        } else {
            char = neutralChars[Math.floor(Math.random() * neutralChars.length)];
        }

    } else if (percent >= 98) {

        if (diffDays > 10) {
            char = neutralChars[Math.floor(Math.random() * neutralChars.length)];
        } else if (diffDays > 5) {
            char = almostChars[Math.floor(Math.random() * almostChars.length)];
        } else if (diffDays > 1) {
            char = fewSadChars[Math.floor(Math.random() * fewSadChars.length)];
        } else if (diffDays == 1) {
            char = sadChars[Math.floor(Math.random() * sadChars.length)];
        } else {
            char = deadChars[Math.floor(Math.random() * deadChars.length)];
        }

    } else if (percent >= 70) {

        if (diffDays > 10) {
            char = neutralChars[Math.floor(Math.random() * neutralChars.length)];
        } else if (diffDays > 5) {
            char = almostChars[Math.floor(Math.random() * almostChars.length)];
        } else if (diffDays > 1) {
            char = sadChars[Math.floor(Math.random() * sadChars.length)];
        } else if (diffDays == 1) {
            char = verySadChars[Math.floor(Math.random() * verySadChars.length)];
        } else {
            char = deadChars[Math.floor(Math.random() * deadChars.length)];
        }

    } else if (percent >= 50) {

        if (diffDays > 20) {
            char = neutralChars[Math.floor(Math.random() * neutralChars.length)];
        } else if (diffDays > 15) {
            char = almostChars[Math.floor(Math.random() * almostChars.length)];
        } else if (diffDays > 10) {
            char = fewSadChars[Math.floor(Math.random() * fewSadChars.length)];
        } else if (diffDays > 5) {
            char = sadChars[Math.floor(Math.random() * sadChars.length)];
        } else if (diffDays > 1) {
            char = verySadChars[Math.floor(Math.random() * verySadChars.length)];
        } else if (diffDays == 1) {
            char = verySadChars[Math.floor(Math.random() * verySadChars.length)];
        } else {
            char = deadChars[Math.floor(Math.random() * deadChars.length)];
        }

    } else if (percent >= 33) {

        if (diffDays > 15) {
            char = neutralChars[Math.floor(Math.random() * neutralChars.length)];
        } else if (diffDays > 10) {
            char = almostChars[Math.floor(Math.random() * almostChars.length)];
        } else if (diffDays > 5) {
            char = fewSadChars[Math.floor(Math.random() * fewSadChars.length)];
        } else if (diffDays > 1) {
            char = sadChars[Math.floor(Math.random() * sadChars.length)];
        } else if (diffDays == 1) {
            char = verySadChars[Math.floor(Math.random() * verySadChars.length)];
        } else {
            char = deadChars[Math.floor(Math.random() * deadChars.length)];
        }

    } else {

        if (diffDays > 20) {
            char = almostChars[Math.floor(Math.random() * almostChars.length)];
        } else if (diffDays > 5) {
            char = fewSadChars[Math.floor(Math.random() * fewSadChars.length)];
        } else if (diffDays > 1) {
            char = sadChars[Math.floor(Math.random() * sadChars.length)];
        } else if (diffDays == 1) {
            char = verySadChars[Math.floor(Math.random() * verySadChars.length)];
        } else {
            char = deadChars[Math.floor(Math.random() * deadChars.length)];
        }

    }

    arrChars.push(char);

    var diffToTarget = SISBBPoints - metaPoints;

    var date1 = new Date(choosenDate);
    var date2 = new Date(otherDate);

    var totalDiffDays = this.getBusinessDatesCount(date1, date2);

    if (diffToTarget >= 0) {
        arrChars.push(championChars[Math.floor(Math.random() * championChars.length)]);
    } else {
        arrChars.push("\x1b[33m[" + Math.abs(diffToTarget) + "pts] \x1b[0m");
    }

    var expected = Math.round((metaPoints / totalDiffDays) * (totalDiffDays - diffDays));

    if (SISBBPoints < expected) {
        arrChars.push("\x1b[31m[" + Math.abs(expected) + "pts] \x1b[0m");
    }

    return arrChars;

}

Date.prototype.addDays = function (days) {
    var date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
}

Date.prototype.addYears = function (year) {
    var date = new Date(this.valueOf());
    date.setFullYear(date.getFullYear() + year);
    return date;
}
