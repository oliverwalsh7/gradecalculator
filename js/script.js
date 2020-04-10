const PORT = 3000;
const HOST = `localhost:${PORT}`;

import GradeCalculator from './GradeCalculator.js';
import PassFailCalculator from './PassFailCalculator.js';

const passFailCalcPage = new PassFailCalculator();
const classGradeCalcPage = new GradeCalculator();

$(document).ready(function() {

    passFailCalcPage.show();

    $('#submit-btn').click(function() {
        passFailCalcPage.submit();
    });

    $('#addRow-btn').click(function() {
        
        if (passFailCalcPage.getClassCount() < passFailCalcPage.getMaxClassCount()) passFailCalcPage.addNewRow();
    
    });

    $('#removeRow-btn').click(function() {
        passFailCalcPage.removeRow();
    });

    // $('.input-button').click(function() {
    //     passFailCalcPage.isChecked($(this).attr('id'));
    // });

    $('#classGradeCalc-page-btn').click(function () {
        passFailCalcPage.hide();
        classGradeCalcPage.show();
    });

    $('#passFailCalc-page-btn').click(function () {
        classGradeCalcPage.hide();
        passFailCalcPage.show();
    });

    $('#classGradeCalc-submit-btn').click(function() {
        console.log("Got into submit event handler");
        classGradeCalcPage.submit();
    });

    $('#classGradeCalc-addRow-btn').click(function() {
        if (classGradeCalcPage.getRowCount() < classGradeCalcPage.getMaxRowCount()) {
            classGradeCalcPage.addNewRow();
        }
    });

    $('#classGradeCalc-removeRow-btn').click(function() {
        classGradeCalcPage.removeRow();
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

// function constructInitialPassFailStatuses() {
//     for (var i = 1; i <= classCount; i++) {
//         passFailStatuses[i] = 0;
//     }
// }

// function isNewGPAGreater(maxGPA, newGPAHours, newQualityPoints) {
//     var newGPA = newQualityPoints / newGPAHours;
//     if (newGPA > maxGPA) {
//         return true;
//     }
//     return false;
// }

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