const grades = ['N/A','A+', 'A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'D+', 'D', 'D-', 'F'];
const gpaScaleUnchecked = ['4.3', '4.0', '3.7','3.3','3.0','2.7','2.3','2.0','1.7','1.3','1.0','0.7','0'];
const gpaScaleChecked =  ['4.33', '4.0', '3.67','3.33','3.0','2.67','2.33','2.0','1.67','1.33','1.0','0.67','0'];

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

    static getAppGrades() {
        return grades;
    }

    static getGpaScaleUnchecked() {
        return gpaScaleUnchecked;
    }

    static getGpaScaleChecked() {
        return gpaScaleChecked;
    }

}