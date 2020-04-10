function isChecked(id) {
    console.log("id is: " + id);
    // Get the checkbox
    var checkBox = document.getElementById(id);
    // Get the output text
    var text = document.getElementById("oldGrade-"+ id);
    var col = document.getElementById("th");

    if (id == undefined) {
        console.log("it is undefined");
        //col.style.display = "none";
        return;
    }

    // If the checkbox is checked, display the output text
    if (checkBox.checked == true){
        console.log("Checkbox is checked");
        text.style.display = "block";
        text.style.position = "inherit";
        //col.style.display = "block";
    } else {
        console.log("Checkbox is unchecked");
        text.style.display = "none";
        // /col.style.display = "none";
    }
}