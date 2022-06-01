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