import Utils from './Utils.js';

const grades = ['N/A','A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'D+', 'D', 'D-', 'F'];
const credits = ['N/A','1', '1.5', '2','3','4'];
const startingClassCount = 4;
var currentCourses = [];
var currCumGPA;
var newMaxGPA;
var semesterGPA;
var passFailSemesterGPA;
var cumGPAWithoutPassFail;
var classCount = 0;
var maxClass = 8;

export default class PassFailCalculator {

    constructor() {
        this.isInit = false;
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
        var retakeCellMarkup = "<td class='retakeCell'>" + retakeColm.html() + "</td>";
        
        var oldGradeColm = $('<div class="oldGrade-colm"></div>');
        var oldGradeDropDown = $('<select class="grade-form2">').attr("id","oldGrade-"+classCount).appendTo(oldGradeColm);
        grades.map(function(val) {
            oldGradeDropDown.append($('<option>').attr('val',val).text(val));
        })
        $(oldGradeColm).append(oldGradeDropDown);
        var oldGradeCellMarkup = "<td class='oldGradeCell'>" + oldGradeColm.html() + "</td>";
        
        var passFailColm = $('<div class="passFail-colm"></div>');
        var passFailInput = $('<input class="input-button" type="checkbox">').attr("id","keepGrade-"+classCount).appendTo(passFailColm);
        $(passFailColm).append(passFailInput);
        var passFailCellMarkup = "<td class='keepGradeCell'>" + passFailColm.html() + "</td>";
        
        var rowMarkup = "<tr id='passFailCalc-row-" + classCount + "'>"  
                            + coursesCellMarkup + gradesCellMarkup + creditsCellMarkup + passFailCellMarkup + retakeCellMarkup + oldGradeCellMarkup + 
                        + "</tr>";

        $("#passFailForm-tbody").append(rowMarkup);
    }

    removeRow() {
        if (classCount == 0) {return; }
        $('#passFailCalc-row-'+classCount).remove();
        classCount--;
    }
    
    submit() {
        currentCourses = [];
        var convertedGrade;
        var convertedCredit;
        var convertedOldGrade;
        var isRetaking = false;
        var courseName;
        for (var i = 1; i <= classCount; i++) {
            convertedGrade = this.convertGrade($('#grade-'+i).val());
            convertedCredit = Number($('#credit-'+i).val());
            if (convertedGrade === -1 || isNaN(convertedCredit)) {
                this.errorDisplay();
                return;
            }
            convertedOldGrade = this.convertGrade($('#oldGrade-'+i).val());
            isRetaking = $('#'+i).is(':checked');
            if (isRetaking == true && convertedOldGrade === -1) {
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
                    courseNum: i,
                    grade: convertedGrade, 
                    credits: convertedCredit,
                    oldGrade: convertedOldGrade,
                    isKeepingGrade: false,
                    isRetaking: isRetaking 
                });
        }
        var gpaHours = Number($('#curr-GPA').val());
        var qualityPoints = Number($('#curr-QP').val());
        if (isNaN(gpaHours) || isNaN(qualityPoints)) {
            this.errorDisplay();
            return;
        }
        this.calculateOptimalPassFail(gpaHours, qualityPoints);
        this.calculateSemesterGPAs(gpaHours, qualityPoints);
        this.displayOut();
    }
    
    
    
    calculateOptimalPassFail(gpaHours, qualityPoints) {
        currentCourses.sort(function(a, b) {
            return b.grade - a.grade;
        });
        // Initial cumulative GPA
        var maxGPA = qualityPoints / gpaHours;
        currCumGPA = maxGPA;

        // For optimized cumulative GPA calculation
        var newGPAHours = gpaHours;
        var newQualityPoints = qualityPoints;
        var upperBoundForClassesToTake = 0;
        for (var i = 0; i < classCount; i++) {
            var recalculatedGPAValues = this.doesClassIncreaseGPA(maxGPA, newGPAHours, newQualityPoints, i);
            if (recalculatedGPAValues !== -1) {
                newGPAHours = recalculatedGPAValues.gpaHours;
                newQualityPoints = recalculatedGPAValues.qualityPoints;
                maxGPA = recalculatedGPAValues.maxGPA;
                upperBoundForClassesToTake = i;
                currentCourses[i].isKeepingGrade = true;
                continue;
            }
            break;
        }
        newMaxGPA = maxGPA;
        this.recalculateGPAWhenKeepingGrades(upperBoundForClassesToTake, newGPAHours, newQualityPoints);
    }

    doesClassIncreaseGPA(maxGPA, newGPAHours, newQualityPoints, index) {
        var recalculatedGPAHoursAndQPs = this.recalculateGPAHoursAndQualityPoints(newGPAHours, newQualityPoints, index);
        newMaxGPA = Math.max(maxGPA, (recalculatedGPAHoursAndQPs.qualityPoints / recalculatedGPAHoursAndQPs.gpaHours));
        if (newMaxGPA > maxGPA || (newMaxGPA == 4 && maxGPA == 4)) {
            return {
                maxGPA: newMaxGPA,
                gpaHours: recalculatedGPAHoursAndQPs.gpaHours,
                qualityPoints: recalculatedGPAHoursAndQPs.qualityPoints
            };
        }
        return -1;
    }

    recalculateGPAHoursAndQualityPoints(newGPAHours, newQualityPoints, index) {
        var isClassRetake = currentCourses[index].isRetaking;
        if (isClassRetake == true) {
            var retakeNewQualityPoints = (currentCourses[index].credits * currentCourses[index].grade) 
                                        - (currentCourses[index].credits * currentCourses[index].oldGrade);
            newQualityPoints += retakeNewQualityPoints;
        }
        else {
            newGPAHours += currentCourses[index].credits;
            newQualityPoints += (currentCourses[index].credits * currentCourses[index].grade);
        }

        return {
            gpaHours: newGPAHours,
            qualityPoints: newQualityPoints
        };
    }

    recalculateGPAWhenKeepingGrades(upperBoundForClassesToTake, newGPAHours, newQualityPoints) {
        // Check that if a class must be taken for a grade and what the new gpa will be
        // Must be done after initial gpa calculation in case it decreases the gpa
        var newGPA;
        var recalculatedGPAHoursAndQPs;
        
        for (var i = upperBoundForClassesToTake; i < classCount; i++) {
            // This check is necessary in case the grade for a retaken course would by itself lower the cumulative GPA
            // thus exiting the first optimization loop. However, because a retake acts as a grade replacement 
            // it might still increase the cumulative GPA and needs to be accounted for.
            var isClassRetake = currentCourses[i].isRetaking;
            if (isClassRetake == true && currentCourses[i].isKeepingGrade !== true) {
                var recalculatedGPAValues = this.doesClassIncreaseGPA(newMaxGPA, newGPAHours, newQualityPoints, i);
                if (recalculatedGPAValues.maxGPA !== -1) {
                    newGPAHours = recalculatedGPAValues.gpaHours;
                    newQualityPoints = recalculatedGPAValues.qualityPoints;
                    newGPA = recalculatedGPAValues.maxGPA;
                    currentCourses[i].isKeepingGrade = true;
                    continue;
                }
            }

            var isForceKeepingGrade = $('#keepGrade-'+currentCourses[i].courseNum).is(':checked');
            if (isForceKeepingGrade == true) {
                // This is done because when now the gpa hours and quality points must be set
                // to the new values now matter what
                recalculatedGPAHoursAndQPs = this.recalculateGPAHoursAndQualityPoints(newGPAHours, newQualityPoints, i);
                newGPAHours = recalculatedGPAHoursAndQPs.gpaHours;
                newQualityPoints = recalculatedGPAHoursAndQPs.qualityPoints;

                newGPA = newQualityPoints / newGPAHours; 
                newMaxGPA = newGPA;
                currentCourses[i].isKeepingGrade = true;
            }
        }
    }
    
    calculateSemesterGPAs(gpaHours, qualityPoints) {
        var newGPAHours = 0;
        var newQualityPoints = 0;

        var optimizedSemGPAHours = 0;
        var optimizedSemQualityPoints = 0;

        var cumGPAHours = gpaHours;
        var cumQualityPoints = qualityPoints;

        var recalculatedGPAHoursAndQPs;
        for (var i = 0; i < classCount; i++) {
            newGPAHours += currentCourses[i].credits;
            newQualityPoints += (currentCourses[i].credits * currentCourses[i].grade);

            recalculatedGPAHoursAndQPs = this.recalculateGPAHoursAndQualityPoints(cumGPAHours, cumQualityPoints, i);
            cumGPAHours = recalculatedGPAHoursAndQPs.gpaHours;
            cumQualityPoints = recalculatedGPAHoursAndQPs.qualityPoints;

            if (currentCourses[i].isKeepingGrade == true) {
                optimizedSemGPAHours += currentCourses[i].credits;
                optimizedSemQualityPoints += (currentCourses[i].credits * currentCourses[i].grade);
            }
        }
        semesterGPA = newQualityPoints / newGPAHours;

        passFailSemesterGPA = optimizedSemQualityPoints / optimizedSemGPAHours;

        cumGPAWithoutPassFail = cumQualityPoints / cumGPAHours;
    }

    isChecked(id) {
        // Get the checkbox
        var checkBox = document.getElementById(id);
        // Get the output text
        var text = document.getElementById("oldGrade-"+ id);
    
        if (id == undefined) {
            //col.style.display = "none";
            return;
        }
    
        // If the checkbox is checked, display the output text
        if (checkBox.checked == true){
            text.style.display = "block";
            text.style.position = "inherit";
            //col.style.display = "block";
        } else {
            text.style.display = "none";
            // /col.style.display = "none";
        }
    }

    errorDisplay() {
        $('#out').empty();
        $('#out').append("Please fill in all required options correctly");
    }
    
    displayOut() {
        $('#out').empty();

        var currGPAText = "Your current cumulative GPA is " + Utils.truncateDecimals(currCumGPA, 2).toFixed(2) + "<br>";

        var semesterGPAText = "Your normal semester GPA without pass fail optimization is " + Utils.truncateDecimals(semesterGPA, 2).toFixed(2) + "<br>";

        var newNotOptmiziedGPAText = "Your new cumulative GPA without pass fail optimization is " 
                                        + Utils.truncateDecimals(cumGPAWithoutPassFail, 2).toFixed(2) + "<br>";

        var optimizedSemGPAText = "Your semester GPA with P/F optimization is " + Utils.truncateDecimals(passFailSemesterGPA, 2).toFixed(2) + "<br>";

        var optimizedGPAText = "Your new cumulative GPA with P/F optimization is " + Utils.truncateDecimals(newMaxGPA, 2).toFixed(2) + 
                      " when keeping these classes for a grade: ";

                 
        var isKeepingAnyClasses = false;
        for (var i = 0; i < classCount; i++) {
            if (currentCourses[i].isKeepingGrade == true) {
                optimizedGPAText += currentCourses[i].name + ", ";
                isKeepingAnyClasses = true;
            }
        }
        if (isKeepingAnyClasses == true) {
            optimizedGPAText = optimizedGPAText.substring(0, optimizedGPAText.length-2);
        }
        else {
            optimizedGPAText += "none";
        }
        var outText = currGPAText + semesterGPAText + newNotOptmiziedGPAText + optimizedSemGPAText + optimizedGPAText;
        $('#out').append(outText);
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