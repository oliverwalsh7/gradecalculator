import Utils from './Utils.js';

const grades = Utils.getAppGrades();
const gpaScaleUnchecked = Utils.getGpaScaleUnchecked();
const gpaScaleChecked =  Utils.getGpaScaleChecked();

export default class About {

    constructor() {
        this.isInit = false;
    }
    
    init() {

        if (!this.isInit) {
            this.isInit = true;     
        }
        
    }

    displayGPAScale() {
        $('#gpa-text').remove();
        var isChecked = $('#gpa-switch').is(':checked');
        var subTextWrapper = $('<div class="sub-text" id="gpa-text"></div>');
        var gpaScaleWrapper = $('.gpa-scale-box');
        var gradeWrapper;
        if (isChecked == false) {
            grades.map((val, index) => {
                // To account for N/A used for display purposes
                if (index !== 0) {  
                    gradeWrapper = $('<div class="grade">' + val + ' = ' + gpaScaleUnchecked[index-1] + '</div>');
                    subTextWrapper.append(gradeWrapper);
                }
            });
        }
        else {
            grades.map((val, index) => {
                if (index !== 0) {  
                    gradeWrapper = $('<div class="grade">' + val + ' = ' + gpaScaleChecked[index-1] + '</div>');
                    subTextWrapper.append(gradeWrapper);
                }
            });
        }
        gpaScaleWrapper.append(subTextWrapper);
    }

    show() {
        this.init();
        this.displayGPAScale();
        $('#about-container').css("display", "flex");
    }

    hide() {
        $('#about-container').hide();
    }

}