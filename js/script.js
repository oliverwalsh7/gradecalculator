const PORT = 3000;
const HOST = `localhost:${PORT}`;

const grades = ['N/A','A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'D+', 'D', 'D-', 'F'];
const credits = ['N/A','1','2','3','4'];
const startingClassCount = 3;
var classCount = 0;
var currentCourses = [];
var newMaxGPA;
var maxClass = 8;

function initializeRows() {
    for (var i = 1; i <= startingClassCount; i++) {
        addNewRow();
        isChecked();
    }
}

function addNewRow() {
    classCount++;
    var course = $('<input class="input-form" placeholder="Class ' + classCount + '" ' + ' />').attr("id","course-"+classCount).appendTo('#courses');
    var newLine = $('<div>\n</div>').appendTo('#courses');
    $('#course').append(course);
    $('#course').append(newLine);

    var gradeDropDown = $('<select class="input-form">').attr("id","grade-"+classCount).appendTo('#grades');
    grades.map(function(val, index) {
        gradeDropDown.append($('<option>').attr('val',val).text(val));
    })
    $('#grades').append(gradeDropDown);

    var creditDropDown = $('<select class="input-form">').attr("id","credit-"+classCount).appendTo('#credits');
    credits.map(function(val, index) {
        creditDropDown.append($('<option>').attr('val',val).text(val));
    })
    $('#credits').append(creditDropDown);

    var retakeDropDown = $('<input class="input-button" type="checkbox" onclick="isChecked()">').attr("id","retake-"+classCount).appendTo('#retakes');
    $('#retakes').append(retakeDropDown);
    $('#retakes').append(newLine);

    var oldGradeDropDown = $('<select class="input-form">').attr("id","oldGrade-"+classCount).appendTo('#oldGrade');
    grades.map(function(val, index) {
        oldGradeDropDown.append($('<option>').attr('val',val).text(val));
    })
    $('#oldGrade').append(oldGradeDropDown);



    console.log("Class Count after adding row: " + classCount);
}

function removeRow() {
    console.log("Before hiding: " + classCount);
    $('#course-'+classCount).remove();
    $('#grade-'+classCount).remove();
    $('#credit-'+classCount).remove();
    $("#retake-"+classCount).remove();
    classCount--;
    console.log("After hiding: " + classCount);
}

function submit() {
    var convertedGrade;
    var convertedCredit;
    var courseName;
    for (var i = 1; i <= classCount; i++) {
        convertedGrade = convertGrade($('#grade-'+i).val());
        convertedCredit = parseInt($('#credit-'+i).val());
        console.log("Converted credit: " + convertedCredit);
        if (convertedGrade === -1 || isNaN(convertedCredit)) {
            errorDisplay();
            return;
        }
        if ($('#course-'+i).val() === '') {
            courseName = $('#course-'+i).attr('placeholder');
        }
        else {
            courseName = $('#course-'+i).val();
        }
        currentCourses.push({ name: courseName, grade: convertedGrade, credits: convertedCredit });
        console.log("Current Course " + i + ": " + currentCourses[i-1].credits + " " + currentCourses[i-1].grade);
    }
    var gpaHours = parseInt($('#curr-GPA').val());
    var qualityPoints = parseInt($('#curr-QP').val());
    var upperBoundForClassesToTake = calculateOptimalPassFail(gpaHours, qualityPoints);
    displayOut(upperBoundForClassesToTake);
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
    var upperBoundForClassesToTake = 0;
    for (var i = 1; i <= classCount; i++) {
        newGPAHours += currentCourses[i - 1].credits;
        newQualityPoints += (currentCourses[i - 1].credits * currentCourses[i - 1].grade);
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

function errorDisplay() {
    $('#out').empty();
    $('#out').append("Please fill in all required options");
}

function displayOut(upperBoundForClassesToTake) {
    $('#out').empty();

    var outText = "Your new GPA is " + truncateDecimals(newMaxGPA, 2) + 
                  " and you should keep credit for these classes: \n";
                  
    if (upperBoundForClassesToTake == 0) { 
        outText += "none"; 
    } 
    for (var i = 1; i <= upperBoundForClassesToTake; i++) {
        if (i === (upperBoundForClassesToTake)) {
            outText += currentCourses[i - 1].name
        }
        else {
            outText += currentCourses[i - 1].name + ", "
        }
    }
    //$('#out').addClass(".output-box-view");
    $('#out').append(outText);

}

function truncateDecimals (num, digits) {
    var numS = num.toString(),
        decPos = numS.indexOf('.'),
        substrLength = decPos == -1 ? numS.length : 1 + decPos + digits,
        trimmedResult = numS.substr(0, substrLength),
        finalResult = isNaN(trimmedResult) ? 0 : trimmedResult;

    return parseFloat(finalResult);
}

function isChecked() {
    // Get the checkbox
    var checkBox = document.getElementById("retake-"+classCount);
    // Get the output text
    var text = document.getElementById("oldGrade-"+classCount);

    // If the checkbox is checked, display the output text
    if (checkBox.checked == true){
        console.log("Checkbox is checked");
        text.style.display = "block";
    } else {
        console.log("Checkbox is unchecked");
        text.style.display = "none";
    }
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
    // $('.output-box').hide();

    $('#submit-btn').click(function() {
        submit();
    });

    $('#addRow-btn').click(function() {
        
        if (classCount < maxClass) addNewRow();
    
    });

    $('#removeRow-btn').click(function() {
        removeRow();
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