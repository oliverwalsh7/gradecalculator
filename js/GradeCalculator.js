export default class GradeCalculator {

    startingClassCount = 5;
    maxRows = 8;
    rowCount = 0;
    gradesWithWeights = [];
    isInit = false;

    constructor() {
    }
    
    init() {

        console.log(this);

        if (!this.isInit) {
            this.isInit = true; 
            this.initializeRows();
        }

        // These click listeners must be called within a $(document).ready function.
        // That is why the JS methods suposedly didn't exist when the buttons were being clicked
        // They were moved into the main script.js file for now
        // $('#classGradeCalc-submit-btn').click(function() {
        //     console.log("Got into submit event handler");
        //     this.submit();
        // });
    
        // $('#classGradeCalc-addRow-btn').click(function() {
        //     console.log("Got into add row event handler");
        //     console.log("Current row count: " + this.rowCount);
        //     if (this.rowCount < this.maxRows) {
        //         this.addNewRow();
        //         console.log("Add Row Click works");
        //     }
        
        // });
        
        // $('#classGradeCalc-removeRow-btn').click(function() {
        //     //this.errorDisplay();
        //     console.log("Got into the remove row event handler");
        //     this.removeRow();
        // });
        
    }

    show() {
        this.init();
        $('#classGradeCalc-container').show();
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

    errorDisplay() {
        $('#classGradeCalc-out').empty();
        $('#classGradeCalc-out').append("Please fill in all required options correctly");
    }

    submit() {
        var gradePercentage;
        var weight;
        for (var i = 1; i <= this.rowCount; i++) {
            gradePercentage = parseInt($('#classGradeCalc-grade-'+i).val());
            weight = parseInt($('#classGradeCalc-weight-'+i).val());
            if (isNaN(gradePercentage) || isNaN(weight)) {
                this.errorDisplay();
                return;
            }
            this.gradesWithWeights.push({ grade: gradePercentage, weight: weight });
            console.log("Grade With Weight " + i + ": " + this.gradesWithWeights[i-1].grade + " " + this.gradesWithWeights[i-1].weight);
        }
        var totalCourseGrade = this.calculateTotalCourseGrade();
        this.displayOut(totalCourseGrade);
    }

    displayOut(totalCourseGrade) {
        $('#classGradeCalc-out').empty();
        console.log("Total course grade: " + totalCourseGrade);
        var outText = "Your grade in this course is " + this.truncateDecimals(totalCourseGrade, 2) +"\n";
                    
        $('#classGradeCalc-out').append(outText);
    }

    calculateTotalCourseGrade() {
        var totalCourseGrade = 0;
        for (var i = 0; i < this.gradesWithWeights.length; i++) {
            console.log("Grade " + i + ": " + this.gradesWithWeights[i].grade);
            console.log("Weight " + i + ": " + this.gradesWithWeights[i].weight);
            totalCourseGrade += (this.gradesWithWeights[i].grade * (this.gradesWithWeights[i].weight / 100));
            console.log("Course grade " + i + ": " + totalCourseGrade);
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

}