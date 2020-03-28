const PORT = 3000;
const HOST = `localhost:${PORT}`;

const grades = ['N/A','A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'D+', 'D', 'D-', 'F'];
const credits = ['N/A','1','2','3','4'];

function inializeGradeRows() {
    var gradeDropDown;
    for (var i = 1; i <= 5; i++) { 
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

function addGradeRow() {

}