const PORT = 3000;
const HOST = `localhost:${PORT}`;

const grades = ['N/A','A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'D+', 'D', 'D-', 'F'];
const credits = ['N/A','1','2','3','4'];
const classCount = 5;

// class, credits, grade
var currentCourses = [ 
    ["class1", 0, 0],
    ["class2", 0, 0],
    ["class3", 0, 0],
    ["class4", 0, 0],
    ["class5", 0, 0]
  ];
  
  // append new value to the array
  //arr.push(["class6", 6]);

function inializeGradeRows() {
    var gradeDropDown;
    for (var i = 1; i <= classCount; i++) { 
        gradeDropDown = $('<select>').attr("id","grade-"+i).appendTo('grade');
        grades.map(function(val, index) {
            gradeDropDown.append($('<option>').attr('val',val).text(val));
        })
        $("#grade").append(gradeDropDown);
    }
}

function initalizeCreditRows() {
    var creditDropDown;
    for (var i = 1; i <= 5; i++) {
        creditDropDown = $('<select>').attr("id","credit-"+i).appendTo('credits');
        credits.map(function(val, index) {
            creditDropDown.append($('<option>').attr('val',val).text(val));
        })
        $('#credits').append(creditDropDown);
    }
}

function addGradeRow(credits, grade) {
    var i = classCount + 1;
    currentCourses.push(["class"+i, credits, grade]);
    classCount = classCount + 1;
}

// Converts the dropdown select options into integers 
function convertGrades(grade) {
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