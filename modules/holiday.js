module.exports.getHolidayBetweenDates = (dateStart, dateEnd, country, state, city) => {

    var dateStartBkp = new Date(dateStart);
    var betweenHolidays = [];
    var holidays = [];

    while (dateEnd > dateStart || dateStart.getFullYear() === dateEnd.getFullYear()) {
        holidays = getHolidays(parseInt(dateStart.getFullYear()), country, state, city);
        dateStart = dateStart.addYears(1);
    }

    dateStart = dateStartBkp;

    for (let i = 0; i < holidays.length; i++) {
        const holiday = holidays[i];
        if (new Date(holiday.m) >= dateStart)
            if (new Date(holiday.m) <= dateEnd)
                betweenHolidays.push(holiday);
    }

    return betweenHolidays;

}

function easterDay(y) {
    var c = Math.floor(y / 100);
    var n = y - 19 * Math.floor(y / 19);
    var k = Math.floor((c - 17) / 25);
    var i = c - Math.floor(c / 4) - Math.floor((c - k) / 3) + 19 * n + 15;
    i = i - 30 * Math.floor((i / 30));
    i = i - Math.floor(i / 28) * (1 - Math.floor(i / 28) * Math.floor(29 / (i + 1)) * Math.floor((21 - n) / 11));
    var j = y + Math.floor(y / 4) + i + 2 - c + Math.floor(c / 4);
    j = j - 7 * Math.floor(j / 7);
    var l = i - j;
    var m = 3 + Math.floor((l + 40) / 44);
    var d = l + 28 - 31 * Math.floor(m / 4);

    return new Date(m + "/" + d + "/" + y);

};

function getHolidays(y, country, state, city) {

    var holidays = [

        { m: new Date("01/01/" + y), dia: "Ano Novo", d: new Date("01/01/" + y).toLocaleDateString(), country: "*", state: "*", city: "*" },
        { m: easterDay(y).addDays(-48), dia: "Carnaval", d: easterDay(y).addDays(-48).toLocaleDateString(), country: "BR", state: "*", city: "*" },
        { m: easterDay(y).addDays(-47), dia: "Carnaval", d: easterDay(y).addDays(-47).toLocaleDateString(), country: "BR", state: "*", city: "*" },
        { m: easterDay(y).addDays(-2), dia: "Paix\u00E3o de Cristo", d: easterDay(y).addDays(-2).toLocaleDateString(), country: "BR", state: "*", city: "*" },
        { m: easterDay(y), dia: "P\u00E1scoa", d: easterDay(y).toLocaleDateString(), country: "BR", state: "*", city: "*" },
        { m: new Date("04/21/" + y), dia: "Tiradentes", d: new Date("04/21/" + y).toLocaleDateString(), country: "BR", state: "*", city: "*" },
        { m: easterDay(y).addDays(60), dia: "Corpus Christi", d: easterDay(y).addDays(60).toLocaleDateString(), country: "BR", state: "*", city: "*" },
        { m: new Date("05/01/" + y), dia: "Dia do Trabalho", d: new Date("05/01/" + y).toLocaleDateString(), country: "BR", state: "*", city: "*" },
        { m: new Date("09/07/" + y), dia: "Dia da Independ\u00EAncia do Brasil", d: new Date("09/07/" + y).toLocaleDateString(), country: "BR", state: "*", city: "*" },
        { m: new Date("10/12/" + y), dia: "Nossa Senhora Aparecida", d: new Date("10/12/" + y).toLocaleDateString(), country: "BR", state: "*", city: "*" },
        { m: new Date("11/02/" + y), dia: "Finados", d: new Date("11/02/" + y).toLocaleDateString(), country: "BR", state: "*", city: "*" },
        { m: new Date("11/15/" + y), dia: "Proclama\u00E7\u00E3o da Rep\u00FAblica", d: new Date("11/15/" + y).toLocaleDateString(), country: "BR", state: "*", city: "*" },
        { m: new Date("12/25/" + y), dia: "Natal", d: new Date("12/25/" + y).toLocaleDateString(), country: "BR", state: "*", city: "*" },

        { m: new Date("03/06/" + y), dia: "Data Magna PE", d: new Date("03/06/" + y).toLocaleDateString(), country: "BR", state: "PE", city: "*" },
        { m: new Date("07/16/" + y), dia: "Nossa Senhora do Carmo", d: new Date("07/16/" + y).toLocaleDateString(), country: "BR", state: "PE", city: "Recife" },
        { m: new Date("12/08/" + y), dia: "Nossa Senhora da Conceição", d: new Date("12/08/" + y).toLocaleDateString(), country: "BR", state: "PE", city: "Recife" },
        { m: new Date("06/24/" + y), dia: "São João", d: new Date("06/24/" + y).toLocaleDateString(), country: "BR", state: "PE", city: "*" }

    ];

    var selectedHolidays = [];

    holidays.forEach(holiday => {

        holiday.isPast = holiday.m < new Date() ? true : false;

        if (
            holiday.country == "*"
            || holiday.country == country && holiday.state == "*"
            || holiday.country == country && holiday.state == state && holiday.city == "*"
            || holiday.country == country && holiday.state == state && holiday.city == city
        )
            selectedHolidays.push(holiday);
            
    });

    return selectedHolidays;

}
