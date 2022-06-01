module.exports.generateCalDatFile = (arrTermOptionsTemp) => {

    var arrCalDat = [];
    var arrTermOptions = [];

    while (arrTermOptionsTemp.length > 0) {

        var maxValue = 0;
        var maxIndex = 0;

        for (let i = 0; i < arrTermOptionsTemp.length; i++) {

            const element = arrTermOptionsTemp[i];

            if (element.qtd > maxValue) {
                maxValue = element.qtd;
                maxIndex = i;
            }

        }

        arrTermOptions.push(arrTermOptionsTemp[maxIndex]);
        arrTermOptionsTemp = arrTermOptionsTemp.filter(function (geeks) {
            return geeks != arrTermOptionsTemp[maxIndex];
        });

    }

    arrTermOptions.forEach(element => {
        if (element.qtd > 0)
            arrCalDat.push({ "name": element.name.replace("\n", ""), "qtd": element.qtd + "\n" });
    })

    var calDatFile = ``;

    arrCalDat.forEach(element => {
        calDatFile += element.name + " " + element.qtd;
    })

    return calDatFile;

}