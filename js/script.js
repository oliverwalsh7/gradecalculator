const PORT = 3000;
const HOST = `localhost:${PORT}`;

const grades = ['N/A','A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'D+', 'D', 'D-', 'F'];
const credits = ['N/A','1','2','3','4'];
const startingClassCount = 5;
var classCount = 0;
var passFailStatuses = {};
var currentCourses = [];
// class, grade value, credits
// var currentCourses = [ 
//     [name: "class1", grade: 0, credits: 0],
//     ["class2", 0, 0],
//     ["class3", 0, 0],
//     ["class4", 0, 0],
//     ["class5", 0, 0]
//   ];
  
// append new value to the array
//arr.push(["class6", 6]);


function initializeRows() {
    for (var i = 1; i <= startingClassCount; i++) {
        addRow();
    }

    console.log("hi");
}

function addNewGradeRow() {
    var gradeDropDown = $('<select>').attr("id","grade-"+classCount).appendTo('#grades');
    grades.map(function(val, index) {
        gradeDropDown.append($('<option>').attr('val',val).text(val));
    })
    $('#grade').append(gradeDropDown);
}

function addNewCreditRow() {
    var creditDropDown = $('<select>').attr("id","credit-"+classCount).appendTo('#credits');
    credits.map(function(val, index) {
        creditDropDown.append($('<option>').attr('val',val).text(val));
    })
    $('#credits').append(creditDropDown);
}

function addRow() {
    classCount++;
    //currentCourses.push(["class"+classCount, 0, 0]);
    addNewGradeRow();
    addNewCreditRow();
}

function submit() {
    var convertedGrade;
    for (var i = 1; i <= classCount; i++) {
        convertedGrade = convertGrade($('#grade-'+i).val());
        currentCourses.push({ name: ["class"+i], grade: convertedGrade, credits: $('#credit-'+i).val() });
    }
    var gpaHours = $('#curr-GPA').val();
    var qualityPoints = $('#curr-QP').val();
    calculateOptimalPassFail(gpaHours, qualityPoints);
}

function calculateOptimalPassFail(gpaHours, qualityPoints) {
    constructInitialPassFailStatuses();
    var maxGPA = qualityPoints / gpaHours;
    var newGPAHours = gpaHours;
    var newQualityPoints = qualityPoints;
    for (var i = 1; i <= classCount+1; i++) {
        for (var j = 0; j < i; j++) {
            newGPAHours += currentCourses[j].credits;
            newQualityPoints += (currentCourses[j].grade * newGPAHours);
            if (isNewGPAGreater(maxGPA, newGPAHours, newQualityPoints)) {
                maxGPA = newGPAHours / newQualityPoints; 
                setPassFailStatuses(j, i);
            } 
            for (var k = i-j-1; k < i; k++) { 
                if (k === (i-j-1)) {     
                    newGPAHours = gpaHours;
                    newQualityPoints = qualityPoints;
                } 
                newGPAHours += currentCourses[k].credits;
                newQualityPoints += (currentCourses[k].grade * newGPAHours);
                if (isNewGPAGreater(maxGPA, newGPAHours, newQualityPoints)) {
                    maxGPA = newGPAHours / newQualityPoints; 
                    setPassFailStatuses(k, i);
                } 
            }
        }  
        newGPAHours = gpaHours;
        newQualityPoints = qualityPoints;
    }
}

function setPassFailStatuses(startIndex, endIndex) {
    for (var i = 0; i <= classCount; i++) {
        if ((i >= startIndex) && (i < endIndex)) { 
            passFailStatuses[i+1] = 1;
        }
        else {
            passFailStatuses[i+1] = 0;
        }
    }
}

function constructInitialPassFailStatuses() {
    for (var i = 1; i <= classCount; i++) {
        passFailStatuses[i] = 0;
    }
}

function isNewGPAGreater(currentGPA, newGPAHours, newQualityPoints) {
    var newGPA = newQualityPoints / newGPAHours;
    if (newGPA > currentGPA) {
        return true;
    }
    return false;
}

// Converts the dropdown select options into integers 
function convertGrade(grade) {
    let newGrade = 0;
    switch (grade) {
        case 'A': 
            newGrade = 4; 
            break;
        case 'A-': 
            newGrade = 3.75; 
            break;
        case 'B+': 
            newGrade = 3.25; 
            break;
        case 'B': 
            newGrade = 3; 
            break;
        case 'B-': 
            newGrade = 2.75; 
            break;
        case 'C+': 
            newGrade = 2.25; 
            break;
        case 'C': 
            newGrade = 2; 
            break;
        case 'C-': 
            newGrade = 1.75; 
            break;
        case 'D+': 
            newGrade = 1.25; 
            break;
        case 'D': 
            newGrade = 1; 
            break;
        case 'D-': 
            newGrade = .75; 
            break;
        case 'F': 
            newGrade = 0; 
            break;
        case '1': 
            newGrade = 1; 
            break;
        case '2': 
            newGrade = 2; 
            break;
        case '3': 
            newGrade = 3; 
            break;
        case '4': 
            newGrade = 4; 
            break;
        default:
            newGrade = -1;
        return newGrade;
    }
}

$(() => {

    initializeRows();

}); 