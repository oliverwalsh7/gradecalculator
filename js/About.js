const grades = ['N/A','A+', 'A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'D+', 'D', 'D-', 'F'];
const gpaScaleUnchecked = ['4.3', '4.0', '3.7','3.3','3.0','2.7','2.3','2.0','1.7','1.3','1.0','0.7','0'];
const gpaScaleChecked =  ['4.33', '4.0', '3.67','3.33','3.0','2.67','2.33','2.0','1.67','1.33','1.0','0.67','0'];

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
        var isChecked = $('#gpa-switch').is(':checked');
        var textWrapper = $('<div class="sub-text"></div>')
        if (isChecked == false) {

        }
    }

    show() {
        this.init();
        $('#about-container').css("display", "flex");
        console.log($('#about-container').css("display"));
    }

    hide() {
        $('#about-container').hide();
    }

}