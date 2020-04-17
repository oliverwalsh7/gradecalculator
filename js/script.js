import GradeCalculator from './GradeCalculator.js';
import PassFailCalculator from './PassFailCalculator.js';
import About from './About.js';

let passFailCalcPage = new PassFailCalculator();
let classGradeCalcPage = new GradeCalculator();
let about = new About();
console.log(about);

classGradeCalcPage.hide();
about.hide();

$(document).ready(function() {

    $('#mobile-nav-options-btn').click(function() {
        if ($("#navBar").attr("class") === "topnav"){
            $("#navBar").addClass("responsive");
        } else{
            $("#navBar").removeClass("responsive");
        }
    });

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

    $('#about-btn').click(function () {
        classGradeCalcPage.hide();
        passFailCalcPage.hide();
        about.show();
    });

    $('#classGradeCalc-page-btn').click(function () {
        passFailCalcPage.hide();
        classGradeCalcPage.show();
        about.hide();
    });

    $('#passFailCalc-page-btn').click(function () {
        classGradeCalcPage.hide();
        about.hide();
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