export default class Utils {

    static truncateDecimals (num, digits) {
        var numS = num.toString(),
            decPos = numS.indexOf('.'),
            substrLength = decPos == -1 ? numS.length : 1 + decPos + digits,
            trimmedResult = numS.substr(0, substrLength),
            finalResult = isNaN(trimmedResult) ? 0 : trimmedResult;
    
        return parseFloat(finalResult);
    }

    static errorDisplay(id) {
        $(id).empty();
        $(id).append("Please fill in all required options correctly");
    }

}