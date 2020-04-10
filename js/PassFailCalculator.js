import Utils from './Utils.js';
//import { isChecked } from './script.js';

const grades = ['N/A','A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'D+', 'D', 'D-', 'F'];
const credits = ['N/A','1','2','3','4'];
const startingClassCount = 5;
var currentCourses = [];
var newMaxGPA;
var classCount = 0;
var maxClass = 8;

export default class PassFailCalculator {

    isInit = false;

    constructor() {
    }

    init() {

        if (!this.isInit) {
            this.isInit = true;
            this.initializeRows();
        }

    }

    show() {
        this.init();
        $('#passFailCalc-container').show();
    }

    hide() {
        this.clearForm();
        $('#passFailCalc-container').hide();
    }

    initializeRows() {
        for (var i = 1; i <= startingClassCount; i++) {
            this.addNewRow();
            this.isChecked();
        }
    }

    addNewRow() {
        classCount++;

        var coursesColm = $('<div class="course-colm"></div>');
        var course = $('<input class="input-form" placeholder="Class ' + classCount + '" ' + ' />').attr("id","course-"+classCount).appendTo(coursesColm);
        $(coursesColm).append(course);
        var coursesCellMarkup = "<td>" + coursesColm.html() + "</td>";

        var gradesColm = $('<div class="grade-colm"></div>');
        var gradeDropDown = $('<select class="input-form">').attr("id","grade-"+classCount).appendTo(gradesColm);
        grades.map(function(val) {
            gradeDropDown.append($('<option>').attr('val',val).text(val));
        })
        $(gradesColm).append(gradeDropDown);
        var gradesCellMarkup = "<td>" + gradesColm.html() + "</td>";

        var creditsColm = $('<div class="credit-colm"></div>');
        var creditDropDown = $('<select class="input-form">').attr("id","credit-"+classCount).appendTo(creditsColm);
        credits.map(function(val) {
            creditDropDown.append($('<option>').attr('val',val).text(val));
        })
        $(creditsColm).append(creditDropDown);
        var creditsCellMarkup = "<td>" + creditsColm.html() + "</td>";

        var retakeColm = $('<div class="retake-colm"></div>');
        var retakeInput = $('<input class="input-button" type="checkbox" onclick="isChecked(this.id)">').attr("id", classCount).appendTo(creditsColm);
        $(retakeColm).append(retakeInput);
        var retakeCellMarkup = "<td>" + retakeColm.html() + "</td>";

        var oldGradeColm = $('<div class="oldGrade-colm"></div>');
        var oldGradeDropDown = $('<select class="grade-form">').attr("id","oldGrade-"+classCount).appendTo(oldGradeColm);
        grades.map(function(val) {
            oldGradeDropDown.append($('<option>').attr('val',val).text(val));
        })
        $(oldGradeColm).append(oldGradeDropDown);
        var oldGradeCellMarkup = "<td>" + oldGradeColm.html() + "</td>";
        console.log("Class Count after adding row: " + classCount);

        var rowMarkup = "<tr id='passFailCalc-row-" + classCount + "'>"  
                            + coursesCellMarkup + gradesCellMarkup + creditsCellMarkup + retakeCellMarkup + oldGradeCellMarkup 
                        + "</tr>";

        $("#passFailForm-tbody").append(rowMarkup);
    }

    removeRow() {
        if (classCount == 0) {return; }
        console.log("Before hiding: " + classCount);
        $('#passFailCalc-row-'+classCount).remove();
        classCount--;
        console.log("After hiding: " + classCount);
    }
    
    submit() {
        var convertedGrade;
        var convertedCredit;
        var convertedOldGrade;
        var courseName;
        for (var i = 1; i <= classCount; i++) {
            convertedGrade = this.convertGrade($('#grade-'+i).val());
            convertedCredit = parseInt($('#credit-'+i).val());
            convertedOldGrade = this.convertGrade($('#oldGrade-'+i).val());
            console.log("Converted credit: " + convertedCredit);
            if (convertedGrade === -1 || isNaN(convertedCredit)) {
                this.errorDisplay();
                return;
            }
            if ($('#course-'+i).val() === '') {
                courseName = $('#course-'+i).attr('placeholder');
            }
            else {
                courseName = $('#course-'+i).val();
            }
            currentCourses.push(
                { 
                    name: courseName, 
                    grade: convertedGrade, 
                    credits: convertedCredit,
                    oldGrade: convertedOldGrade 
                });
            console.log("Current Course " + i + ": " + currentCourses[i-1].credits + " " + currentCourses[i-1].grade);
        }
        var gpaHours = parseInt($('#curr-GPA').val());
        var qualityPoints = parseInt($('#curr-QP').val());
        var upperBoundForClassesToTake = this.calculateOptimalPassFail(gpaHours, qualityPoints);
        this.displayOut(upperBoundForClassesToTake);
        console.log("GPA Hours: " + gpaHours + ", QP: " + qualityPoints);
    }
    
    
    
    calculateOptimalPassFail(gpaHours, qualityPoints) {
        currentCourses.sort(function(a, b) {
            return b.grade - a.grade;
        });
        for (var i = 0; i < currentCourses.length; i++) {
            console.log("Current Course " + i + ": " + currentCourses[i].grade);
        }
        var maxGPA = qualityPoints / gpaHours;
        var newGPAHours = gpaHours;
        var newQualityPoints = qualityPoints;
        var upperBoundForClassesToTake = 0;
        for (var i = 0; i < classCount; i++) {
            var isClassRetake = $('#'+(i+1)).is(":checked");
            console.log("Is class retake: " + isClassRetake);
            if (isClassRetake) {
                var retakeNewQualityPoints = (currentCourses[i].credits * currentCourses[i].grade) 
                                            - (currentCourses[i].credits * currentCourses[i].oldGrade);
                console.log(retakeNewQualityPoints);
                newQualityPoints += retakeNewQualityPoints;
            }
            else {
                newGPAHours += currentCourses[i].credits;
                newQualityPoints += (currentCourses[i].credits * currentCourses[i].grade);
            }
            console.log("maxGPA1 " + maxGPA);
            newMaxGPA = Math.max(maxGPA, (newQualityPoints / newGPAHours));
            console.log("maxGPA2 " + newMaxGPA);
            console.log("(newQualityPoints / newGPAHours) " + (newQualityPoints / newGPAHours));
            if (newMaxGPA !== maxGPA) {
                maxGPA = newMaxGPA;
                console.log("upperBound1 " + upperBoundForClassesToTake);
                upperBoundForClassesToTake = i;
                console.log("upperBound1 " + upperBoundForClassesToTake);
                continue;
            }
            break;
        }
        newMaxGPA = maxGPA;
        console.log(upperBoundForClassesToTake);
        return upperBoundForClassesToTake;
    }

    isChecked(id) {
        console.log("id is: " + id);
        // Get the checkbox
        var checkBox = document.getElementById(id);
        // Get the output text
        var text = document.getElementById("oldGrade-"+ id);
        var col = document.getElementById("th");
    
        if (id == undefined) {
            console.log("it is undefined");
            //col.style.display = "none";
            return;
        }
    
        // If the checkbox is checked, display the output text
        if (checkBox.checked == true){
            console.log("Checkbox is checked");
            text.style.display = "block";
            text.style.position = "inherit";
            //col.style.display = "block";
        } else {
            console.log("Checkbox is unchecked");
            text.style.display = "none";
            // /col.style.display = "none";
        }
    }

    errorDisplay() {
        $('#out').empty();
        $('#out').append("Please fill in all required options");
    }
    
    displayOut(upperBoundForClassesToTake) {
        $('#out').empty();
    
        var outText = "Your new GPA is " + Utils.truncateDecimals(newMaxGPA, 2) + 
                      " and you should keep credit for these classes: \n";
                      
        if (upperBoundForClassesToTake == 0) { 
            outText += "none"; 
        } 
        for (var i = 0; i <= upperBoundForClassesToTake; i++) {
            if (i === (upperBoundForClassesToTake)) {
                outText += currentCourses[i].name
            }
            else {
                outText += currentCourses[i].name + ", "
            }
        }
        $('#out').append(outText);
    
    }

    clearForm() {
        for (var i = 1; i <= this.rowCount; i++) {
            // TODO: make more specific IDs for this calculator
            $('#course-'+i).val('');
            $('#grade-'+i).val('');
            $('#credit-'+i).val('');
        }
    }  
    
    // Converts the dropdown select options into integers 
    convertGrade(grade) {
        let newGrade = 0;
        switch (grade) {
            case 'A': 
                newGrade = 4; 
                break;
            case 'A-': 
                newGrade = 3.7; 
                break;
            case 'B+': 
                newGrade = 3.3; 
                break;
            case 'B': 
                newGrade = 3; 
                break;
            case 'B-': 
                newGrade = 2.7; 
                break;
            case 'C+': 
                newGrade = 2.3; 
                break;
            case 'C': 
                newGrade = 2; 
                break;
            case 'C-': 
                newGrade = 1.7; 
                break;
            case 'D+': 
                newGrade = 1.3; 
                break;
            case 'D': 
                newGrade = 1; 
                break;
            case 'D-': 
                newGrade = .7; 
                break;
            case 'F': 
                newGrade = 0; 
                break;
            default:
                newGrade = -1;
        } 
        return newGrade;
    }

    getClassCount() {
        return classCount;
    }

    getMaxClassCount() {
        return maxClass;
    }

}