import Utils from "./Utils.js";

const startingClassCount = 5;
const maxRows = 8;
var rowCount = 0;
var gradesWithWeights = [];

export default class GradeCalculator {

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
        for (var i = 1; i <= startingClassCount; i++) {
            this.addNewRow();
        }
    }

    addNewRow() {
        rowCount++;

        var gradesColm = $('<div class="grade-colm"></div>');
        var gradeInput = $('<input class="input-form2"/>').attr("id","classGradeCalc-grade-"+rowCount).appendTo(gradesColm);
        $(gradesColm).append(gradeInput);
        var gradesCellMarkup = '<td class="td-class">' + gradesColm.html() + "</td>";

        var weightsColm = $('<div class="weights-colm"></div>');
        var weightInput = $('<input class="input-form2"/>').attr("id","classGradeCalc-weight-"+rowCount).appendTo(weightsColm);
        console.log(weightInput);
        $(weightsColm).append(weightInput.html());
        var weightsCellMarkup = "<td>" + weightsColm.html() + "</td>";

        var rowMarkup = "<tr id='classGradeCalc-row-" + rowCount + "'>" 
                        + gradesCellMarkup + weightsCellMarkup 
                        + "</tr>";
        
        $('#classGradeForm-tbody').append(rowMarkup);
        console.log("Row Count after adding row: " + rowCount);
    }
    
    removeRow() {
        console.log("Before hiding: " + rowCount);
        if (rowCount === 0) { return; }
        $('#classGradeCalc-row-'+rowCount).remove();
        rowCount--;
        console.log("After hiding: " + rowCount);
    }

    errorDisplay() {
        $('#classGradeCalc-out').empty();
        $('#classGradeCalc-out').append("Please fill in all required options correctly");
    }

    submit() {
        var gradePercentage;
        var weight;
        for (var i = 1; i <= rowCount; i++) {
            gradePercentage = parseInt($('#classGradeCalc-grade-'+i).val());
            weight = parseInt($('#classGradeCalc-weight-'+i).val());
            if (isNaN(gradePercentage) || isNaN(weight)) {
                this.errorDisplay();
                return;
            }
            gradesWithWeights.push({ grade: gradePercentage, weight: weight });
            console.log("Grade With Weight " + i + ": " + gradesWithWeights[i-1].grade + " " + gradesWithWeights[i-1].weight);
        }
        var totalCourseGrade = this.calculateTotalCourseGrade();
        this.displayOut(totalCourseGrade);
    }

    displayOut(totalCourseGrade) {
        $('#classGradeCalc-out').empty();
        console.log("Total course grade: " + totalCourseGrade);
        var outText = "Your grade in this course is " + Utils.truncateDecimals(totalCourseGrade, 2) +"\n";
                    
        $('#classGradeCalc-out').append(outText);
    }

    calculateTotalCourseGrade() {
        var totalCourseGrade = 0;
        for (var i = 0; i < gradesWithWeights.length; i++) {
            console.log("Grade " + i + ": " + gradesWithWeights[i].grade);
            console.log("Weight " + i + ": " + gradesWithWeights[i].weight);
            totalCourseGrade += (gradesWithWeights[i].grade * (gradesWithWeights[i].weight / 100));
            console.log("Course grade " + i + ": " + totalCourseGrade);
        }
        return totalCourseGrade;
    }

    clearForm() {
        for (var i = 1; i <= rowCount; i++) {
            $('#classGradeCalc-grade-'+i).val('');
            $('#classGradeCalc-weight-'+i).val('');
        }
    } 
    
    getRowCount() {
        return rowCount;
    }

    getMaxRowCount() {
        return maxRows;
    }

}