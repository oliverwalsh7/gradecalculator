const PORT = 3000;
const HOST = `localhost:${PORT}`;

const grades = ['N/A','A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'D+', 'D', 'D-', 'F'];
const credits = ['N/A','1','2','3','4'];
const startingClassCount = 5;
var classCount = 0;
var passFailStatuses = {};
var currentCourses = [];
var newGPAHours = 0;
var newQualityPoints = 0;

// class, grade value, credits
// var currentCourses = [ 
//     [name: "class1", grade: 0, credits: 0],
//     [name: "class2", grade: 0, credits: 0],
//     [name: "class3", grade: 0, credits: 0],
//     [name: "class4", grade: 0, credits: 0],
//     [name: "class5", grade: 0, credits: 0]
//   ];
  
// append new value to the array
//arr.push(["class6", 6]);


function initializeRows() {
    for (var i = 1; i <= startingClassCount; i++) {
        //addRow();
        addNewRow();
    }
}

function addNewRow() {
    classCount++;
    var course = $('<input class="input-form"/>').attr("id","course-"+classCount).appendTo('#courses');
    var newLine = $('<div>\n</div>').appendTo('#courses');
    $('#course').append(course);
    $('#course').append(newLine);

    var gradeDropDown = $('<select class="input-form">').attr("id","grade-"+classCount).appendTo('#grades');
    grades.map(function(val, index) {
        gradeDropDown.append($('<option>').attr('val',val).text(val));
    })
    $('#grade').append(gradeDropDown);

    var creditDropDown = $('<select class="input-form">').attr("id","credit-"+classCount).appendTo('#credits');
    credits.map(function(val, index) {
        creditDropDown.append($('<option>').attr('val',val).text(val));
    })
    $('#credits').append(creditDropDown);
}

// function addNewGradeRow() {
//     var gradeDropDown = $('<select>').attr("id","grade-"+classCount).appendTo('#grades');
//     grades.map(function(val, index) {
//         gradeDropDown.append($('<option>').attr('val',val).text(val));
//     })
//     $('#grade').append(gradeDropDown);
// }

// function addNewCreditRow() {
//     var creditDropDown = $('<select>').attr("id","credit-"+classCount).appendTo('#credits');
//     credits.map(function(val, index) {
//         creditDropDown.append($('<option>').attr('val',val).text(val));
//     })
//     $('#credits').append(creditDropDown);
// }

// function addRow() {
//     classCount++;
//     //currentCourses.push(["class"+classCount, 0, 0]);
//     addNewGradeRow();
//     addNewCreditRow();
// }

function submit() {
    var convertedGrade;
    for (var i = 1; i <= classCount; i++) {
        convertedGrade = convertGrade($('#grade-'+i).val());
        console.log("Converted Grade: " + convertedGrade);
        convertedCredit = parseInt($('#credit-'+i).val());
        console.log('Converted Credit: ' + convertedCredit);
        currentCourses.push({ name: ["class"+i], grade: convertedGrade, credits: convertedCredit });
        console.log("Current Course " + i + ": " + currentCourses[i-1].credits + " " + currentCourses[i-1].grade);
    }
    var gpaHours = parseInt($('#curr-GPA').val());
    var qualityPoints = parseInt($('#curr-QP').val());
    var classStatusesAndNewGPA = calculateOptimalPassFail(gpaHours, qualityPoints);
    console.log("GPA Hours: " + gpaHours + ", QP: " + qualityPoints);
}

function calculateOptimalPassFail(gpaHours, qualityPoints) {
    currentCourses.sort(function(a, b) {
        return b.grade - a.grade;
    });
    for (var i = 0; i < currentCourses.length; i++) {
        console.log("Current Course " + i + ": " + currentCourses[i].grade);
    }
    var maxGPA = qualityPoints / gpaHours;
    var newGPAHours = gpaHours;
    var newQualityPoints = qualityPoints;
    var upperBoundForClassesToTake;
    for (var i = 0; i < classCount; i++) {
        newGPAHours += currentCourses[i].credits;
        newQualityPoints += (currentCourses[i].credits * currentCourses[i].grade);
        maxGPA = Math.max(maxGPA, (newQualityPoints / newGPAHours));
        if (maxGPA !== (newQualityPoints / newGPAHours)) {
            upperBoundForClassesToTake = i;
        }
    }
    return { gpa: maxGPA, upperBoundForClassesToTake: upperBoundForClassesToTake };
}

function constructInitialPassFailStatuses() {
    for (var i = 1; i <= classCount; i++) {
        passFailStatuses[i] = 0;
    }
}

function isNewGPAGreater(maxGPA, newGPAHours, newQualityPoints) {
    var newGPA = newQualityPoints / newGPAHours;
    if (newGPA > maxGPA) {
        return true;
    }
    return false;
}

function displayOut () {
    var outText = "Your new GPA is " + newGPAHours + 
                  " and your new number of quality points is " + newQualityPoints;
    $('#out').append(outText);
}

// Converts the dropdown select options into integers 
function convertGrade(grade) {
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

$(() => {

    initializeRows();

    $('#submit-btn').click(function() {
        submit();
        displayOut();
    });

});

/*
*
*   OG Unnecessarily Hard Algorithm. It almost worked. RIP
*
*/
// function calculateOptimalPassFail(gpaHours, qualityPoints) {
//     constructInitialPassFailStatuses();
//     var maxGPA = qualityPoints / gpaHours;
//     var tempMaxGPA = qualityPoints / gpaHours;
//     var newGPAHours = gpaHours;
//     var newQualityPoints = qualityPoints;
//     var countLowerClassForGrade = false;
//     var countAllLowerClassesForGrade = false;
//     var tempGPAHours;
//     var tempQualityPoints;
//     var upperClassesToNotCount = 0;
//     for (var i = 1; i <= classCount; i++) {
//         console.log("i: " + i);
//         for (var j = 0; j < i; j++) {
//             console.log("j: " + j);
//             newGPAHours += currentCourses[j].credits;
//             console.log("New GPA Hours: " + newGPAHours);
//             newQualityPoints += (currentCourses[j].grade * currentCourses[j].credits);
//             console.log("New QP: " + newQualityPoints);
//             console.log("New GPA: " + (newQualityPoints / newGPAHours));
//             console.log("Max GPA: " + maxGPA);
//             if (isNewGPAGreater(maxGPA, newGPAHours, newQualityPoints)) {
//                 maxGPA = newQualityPoints / newGPAHours; 
//                 countLowerClassForGrade = true;
//                 setPassFailStatuses(0, j, countLowerClassForGrade, j);
//             } 
//             tempGPAHours += currentCourses[j].credits;
//             tempQualityPoints += (currentCourses[j].grade * currentCourses[j].credits);
//             if (isNewGPAGreater(maxGPA, tempGPAHours, tempQualityPoints)) {
//                 tempMaxGPA = tempQualityPoints / tempGPAHours; 
//                 countAllLowerClassesForGrade = true;
//                 setPassFailStatuses(0, j, countAllLowerClassesForGrade, j);
//             }
//             for (var k = classCount-1; k >= i-j-1; k--) { 
//                 if (k === (classCount-1) && (!countAllLowerClassesForGrade || !countLowerClassForGrade)) {     
//                     newGPAHours = gpaHours;
//                     newQualityPoints = qualityPoints;
//                 }
//                 tempGPAHours += currentCourses[k].credits;
//                 tempQualityPoints += (currentCourses[k].grade * currentCourses[k].credits);
//                 console.log("K: " + k);
//                 if (isNewGPAGreater(tempMaxGPA, tempGPAHours, tempQualityPoints)) {
//                     tempMaxGPA = tempQualityPoints / tempGPAHours; 
//                     setPassFailStatuses(k, classCount-upperClassesToNotCount, countAllLowerClassesForGrade, j);
//                 }
//                 newGPAHours += currentCourses[k].credits;
//                 newQualityPoints += (currentCourses[k].grade * currentCourses[k].credits);
//                 if (isNewGPAGreater(maxGPA, newGPAHours, newQualityPoints)) {
//                     maxGPA = newQualityPoints / newGPAHours; 
//                     setPassFailStatuses(k, classCount-upperClassesToNotCount, countLowerClassForGrade, j);
//                 }
//                 upperClassesToNotCount++;
//                 console.log("Upper classes to not count: " + upperClassesToNotCount);
//             }  
//             newGPAHours = gpaHours;
//             newQualityPoints = qualityPoints;
//         }
//         tempGPAHours = gpaHours;
//         tempQualityPoints = qualityPoints;
//         countAllLowerClassesForGrade = false;
//         countLowerClassForGrade = false;
//         upperClassesToNotCount = 0;
//     }
//     console.log("Max GPA: " + maxGPA + ", Temp Max GPA: " + tempMaxGPA);
//     for (var i = 1; i <= classCount; i++) {
//         console.log("Pass Fail Status Class " + i + ": " + passFailStatuses[i]);
//     }
// }

// function setPassFailStatuses(startIndex, endIndex, countLowerClassesForGrade, lowerClassesBound) {
//     for (var i = 0; i < classCount; i++) {
//         if ((i >= startIndex) && (i < endIndex)) { 
//             passFailStatuses[i+1] = 1;
//         }
//         if (countLowerClassesForGrade && i <= lowerClassesBound) {
//             passFailStatuses[i+1] = 1;
//         }
//         else if (countLowerClassesForGrade && i > lowerClassesBound && i < endIndex) {
//             passFailStatuses[i+1] = 0;
//         }
//     }
// }