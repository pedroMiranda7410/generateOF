module.exports.cleanSpreedsheet = (worksheet) => {

    for (var i = 0; i < 50; i++) {
        let row = worksheet.getRow(i);
        row.getCell(3).value = "";
        row.getCell(4).value = "";
        row.getCell(5).value = "";
        row.getCell(7).value = "";
        row.getCell(8).value = "";
        row.getCell(11).value = "";
        row.getCell(12).value = "";
        row.commit();
    }

}

module.exports.writeToFiles = (QTD, points, options, tmpFile, files, filesTXT, worksheet, rowCounter) => {

    if (QTD > 0) {

        tmpFile += `${filesTXT}\n ${files}\n`;
        tmpFile += `    Total: ${QTD} arquivos\n`;
        tmpFile += `    Pontuação: ${QTD * points} SISBB\n\n`;

    }

    return { 'tmpFile': tmpFile, 'rowCounter': rowCounter };

}

module.exports.writeToXLS = (QTD, options, files, worksheet, rowCounter) => {

    if (QTD > 0) {

        let row = worksheet.getRow(rowCounter);
        row.getCell(3).value = options[0];
        row.getCell(4).value = options[1];
        row.getCell(5).value = options[2];
        row.getCell(7).value = options[3];
        row.getCell(8).value = options[4];
        row.getCell(11).value = QTD;
        row.getCell(12).value = files;
        row.commit();
        rowCounter++;

    }

    return { 'rowCounter': rowCounter };

}