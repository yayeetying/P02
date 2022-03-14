var c = document.getElementById("gamec");
var cduck;
var ctx = c.getContext("2d");


function load_duck() {
    console.log(cname);
    console.log(cskin);
    cduck = new Ducky(cname, cskin);
}

window.onload = function() {
    console.log("test");
    load_duck();
};