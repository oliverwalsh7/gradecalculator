
export default class About {

    constructor() {
        this.isInit = false;
    }
    
    init() {

        if (!this.isInit) {
            this.isInit = true; 
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