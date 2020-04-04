export default class GradeCalculator {

    constructor() {
        this.startingClassCount = 5;
        this.maxRows = 8;
        this.rowCount = 0;
        this.gradesWithWeights = [];
        this.isInit = 0;
    }

    addNewRow() {
        this.rowCount++;
        var gradeInput = $('<input class="input-form"/>').attr("id","classGradeCalc-grade-"+this.rowCount).appendTo('#classGradeCalc-grades');
        var newLine = $('<div>\n</div>').appendTo('#grades');
        $('#classGradeCalc-grades').append(gradeInput);
        $('#classGradeCalc-grades').append(newLine);
    
        var weightInput = $('<input class="input-form"/>').attr("id","classGradeCalc-weight-"+this.rowCount).appendTo('#classGradeCalc-weights');
        var newLine = $('<div>\n</div>').appendTo('#grades');
        $('#classGradeCalc-weights').append(weightInput);
        $('#classGradeCalc-weight').append(newLine);
    
        console.log("Row Count after adding row: " + this.rowCount);
    }
    
    removeRow() {
        console.log("Before hiding: " + this.rowCount);
        $('#classGradeCalc-grade-'+this.rowCount).remove();
        $('#classGradeCalc-weight-'+this.rowCount).remove();
        this.rowCount--;
        console.log("After hiding: " + this.rowCount);
    }
    
    init() {

        if (!this.isInit) {
            this.isInit = true;
        }

        $('#classGradeCalc-submit-btn').click(function() {
            console.log("Got into submit event handler");
            this.submit();
        });
    
        $('#classGradeCalc-addRow-btn').click(function() {
            console.log("Got into add row event handler");
            if (this.rowCount < this.maxRows) {
                this.addNewRow()
                console.log("Add Row Click works");
            };
        
        });
    
        $('#classGradeCalc-removeRow-btn').click(function() {
            console.log("Got into the remove row event handler");
            this.removeRow();
        });
    }

    show() {
        this.init();
        $('#classGradeCalc-container').show();
        this.initializeRows();
    }

    hide() {
        this.clearForm();
        $('#classGradeCalc-container').hide();
    }

    initializeRows() {
        for (var i = 1; i <= this.startingClassCount; i++) {
            this.addNewRow();
        }
    }


    submit() {
        var gradePercentage;
        var weight;
        for (var i = 1; i <= this.rowCount; i++) {
            gradePercentage = parseInt($('#classGradeCalc-grade-'+i).val());
            weight = parseInt($('#classGradeCalc-weight-'+i).val());
            if (isNaN(gradePercentage) || isNaN(weight)) {
                errorDisplay();
                return;
            }
            this.gradesWithWeights.push({ grade: gradePercentage, weight: weight });
            console.log("Grade With Weight " + i + ": " + this.gradesWithWeights[i-1].grade + " " + this.gradesWithWeights[i-1].weight);
        }
        var totalCourseGrade = calculateTotalCourseGrade();
        displayOut(totalCourseGrade);
    }

    displayOut(totalCourseGrade) {
        $('#classGradeCalc-out').empty();
    
        var outText = "Your grade in this course is " + this.truncateDecimals(totalCourseGrade) +"\n";
                    
        $('#classGradeCalc-out').append(outText);
    }

    calculateTotalCourseGrade() {
        var totalCourseGrade;
        for (var i = 0; i < this.gradesWithWeights.length; i++) {
            totalCourseGrade += this.gradesWithWeights[i].grade * (this.gradesWithWeights[i].weight / 100);
        }
        return totalCourseGrade;
    }

    clearForm() {
        for (var i = 1; i <= this.rowCount; i++) {
            $('#classGradeCalc-grade-'+i).val('');
            $('#classGradeCalc-weight-'+i).val('');
        }
    }   

    truncateDecimals(num, digits) {
        var numS = num.toString(),
            decPos = numS.indexOf('.'),
            substrLength = decPos == -1 ? numS.length : 1 + decPos + digits,
            trimmedResult = numS.substr(0, substrLength),
            finalResult = isNaN(trimmedResult) ? 0 : trimmedResult;
    
        return parseFloat(finalResult);
    }

    errorDisplay = function() {
        $('#classGradeCalc-out').empty();
        $('#classGradeCalc-out').append("Please fill in all required options correctly");
    }

}