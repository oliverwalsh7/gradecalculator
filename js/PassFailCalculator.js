import Utils from './Utils.js';

const grades = ['N/A','A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'D+', 'D', 'D-', 'F'];
const credits = ['N/A','1','2','3','4'];
const startingClassCount = 5;
var currentCourses = [];
var newMaxGPA;
var semesterGPA;
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
        var gradeDropDown = $('<select class="input-form2">').attr("id","grade-"+classCount).appendTo(gradesColm);
        grades.map(function(val) {
            gradeDropDown.append($('<option>').attr('val',val).text(val));
        })
        $(gradesColm).append(gradeDropDown);
        var gradesCellMarkup = "<td>" + gradesColm.html() + "</td>";
        
        var creditsColm = $('<div class="credit-colm"></div>');
        var creditDropDown = $('<select class="input-form2">').attr("id","credit-"+classCount).appendTo(creditsColm);
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
        var oldGradeDropDown = $('<select class="grade-form2">').attr("id","oldGrade-"+classCount).appendTo(oldGradeColm);
        grades.map(function(val) {
            oldGradeDropDown.append($('<option>').attr('val',val).text(val));
        })
        $(oldGradeColm).append(oldGradeDropDown);
        var oldGradeCellMarkup = "<td>" + oldGradeColm.html() + "</td>";
        
        var passFailColm = $('<div class="passFail-colm"></div>');
        var passFailInput = $('<input class="input-button" type="checkbox">').attr("id","keepGrade-"+classCount).appendTo(passFailColm);
        $(passFailColm).append(passFailInput);
        var passFailCellMarkup = "<td>" + passFailColm.html() + "</td>";
        
        console.log("Class Count after adding row: " + classCount);
        var rowMarkup = "<tr id='passFailCalc-row-" + classCount + "'>"  
                            + coursesCellMarkup + gradesCellMarkup + creditsCellMarkup + retakeCellMarkup + oldGradeCellMarkup + passFailCellMarkup
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
        currentCourses = [];
        var convertedGrade;
        var convertedCredit;
        var convertedOldGrade;
        var forceKeepGrade = false;
        var courseName;
        for (var i = 1; i <= classCount; i++) {
            convertedGrade = this.convertGrade($('#grade-'+i).val());
            convertedCredit = parseInt($('#credit-'+i).val());
            convertedOldGrade = this.convertGrade($('#oldGrade-'+i).val());
            //forceKeepGrade = $('#keepGrade-'+i).is(':checked');
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
                    oldGrade: convertedOldGrade,
                    isKeepingGrade: forceKeepGrade 
                });
            console.log("Is Keeping Grade: " + currentCourses[i-1].isKeepingGrade);
            console.log("Current Course " + i + ": " + currentCourses[i-1].credits + " " + currentCourses[i-1].grade);
        }
        var gpaHours = parseInt($('#curr-GPA').val());
        var qualityPoints = parseInt($('#curr-QP').val());
        this.calculateOptimalPassFail(gpaHours, qualityPoints);
        this.calculateSemesterGPA();
        this.displayOut();
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
            if (isClassRetake == true) {
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
            if (newMaxGPA > maxGPA || (newMaxGPA == 4 && maxGPA == 4)) {
                maxGPA = newMaxGPA;
                console.log("upperBound1 " + upperBoundForClassesToTake);
                upperBoundForClassesToTake = i;
                console.log("i before setting keeping grade:" + i);
                currentCourses[i].isKeepingGrade = true;
                continue;
            }
            break;
        }
        newMaxGPA = maxGPA;
        console.log("Upper bound: " + upperBoundForClassesToTake);
        this.recalculateGPAWhenKeepingGrades(upperBoundForClassesToTake, newGPAHours, newQualityPoints);
    }

    recalculateGPAWhenKeepingGrades(upperBoundForClassesToTake, newGPAHours, newQualityPoints) {
        // Check that if a class must be taken for a grade and what the new gpa will be
        // Must be done after initial gpa calculation in case it decreases the gpa
        var newGPA;
        
        console.log("Recalculation 1 (newQP / newQPAHours): " + (newQualityPoints / newGPAHours));
        if (upperBoundForClassesToTake < classCount) {
            for (var i = upperBoundForClassesToTake+1; i < classCount; i++) {
                var isForceKeepingGrade = $('#keepGrade-'+(i+1)).is(':checked');;
                console.log("i in recalculation check:" + i);
                console.log("Is Force Keep Grade Checked: " + isForceKeepingGrade);
                if (isForceKeepingGrade == true) {
                    var isClassRetake = $('#'+(i+1)).is(":checked");
                    console.log("Is class retake: " + isClassRetake);
                    // This is done because when we exit the optimization calculation the new GPA hours
                    // and new QP are already calculated, as that class is what caused it to leave the optimization loop
                    if (i > (upperBoundForClassesToTake+1)) {
                        if (isClassRetake == true) {
                            var retakeNewQualityPoints = (currentCourses[i].credits * currentCourses[i].grade) 
                                                        - (currentCourses[i].credits * currentCourses[i].oldGrade);
                            console.log(retakeNewQualityPoints);
                            newQualityPoints += retakeNewQualityPoints;
                        }
                        else {
                            newGPAHours += currentCourses[i].credits;
                            newQualityPoints += (currentCourses[i].credits * currentCourses[i].grade);
                        }
                    }
                    console.log("Recalculation 2 (newQP / newQPAHours): " + (newQualityPoints / newGPAHours));
                    newGPA = newQualityPoints / newGPAHours; 
                    newMaxGPA = newGPA;
                    currentCourses[i].isKeepingGrade = true;
                }
            }
        }
        console.log(newGPA);
    }  
    
    calculateSemesterGPA() {
        var newGPAHours = 0;
        var newQualityPoints = 0;
        for (var i = 0; i < classCount; i++) {
            var isClassRetake = $('#'+(i+1)).is(":checked");
            console.log("Is class retake: " + isClassRetake);
            if (isClassRetake == true) {
                var retakeNewQualityPoints = (currentCourses[i].credits * currentCourses[i].grade) 
                                            - (currentCourses[i].credits * currentCourses[i].oldGrade);
                console.log(retakeNewQualityPoints);
                newQualityPoints += retakeNewQualityPoints;
            }
            else {
                newGPAHours += currentCourses[i].credits;
                newQualityPoints += (currentCourses[i].credits * currentCourses[i].grade);
            }
        }
        semesterGPA = newQualityPoints / newGPAHours;
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
    
    displayOut() {
        $('#out').empty();
        var semesterGPAText = "Your semester GPA is " + Utils.truncateDecimals(semesterGPA, 2).toFixed(2) + "<br>";

        var outText = "<br>Your new GPA is " + Utils.truncateDecimals(newMaxGPA, 2).toFixed(2) + 
                      " and you should keep these classes for a grade: ";
                 
        var isKeepingAnyClasses = false;
        for (var i = 0; i < classCount; i++) {
            if (currentCourses[i].isKeepingGrade == true) {
                outText += currentCourses[i].name + ", ";
                console.log(currentCourses[i].name);
                isKeepingAnyClasses = true;
            }
        }
        if (isKeepingAnyClasses == true) {
            outText = outText.substring(0, outText.length-2);
        }
        else {
            outText += "none";
        }
        semesterGPAText += outText;
        console.log(semesterGPAText);
        $('#out').append(semesterGPAText);
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