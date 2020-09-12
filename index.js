window.onload = function () {
  hookUpMenu();
}



var hookUpMenu = function () {
  $("#logo h1").on("click", function (e) {
    window.location.href = "index.html"; // Logo returns you to the home page
  });

  $(".topMenuOption#blog").on("click", function (e) {
    alert("This page is currently under construction. Check back soon!");
  });

  $(".topMenuOption#resume").on("click", function (e) {
    alert("This page is currently under construction. Check back soon!");
  });

  $(".topMenuOption#github").on("click", function (e) {
    window.location.href = "https://github.com/ripit97";
  });

  $(".topMenuOption#dots").on("click", function (e) {
    window.location.href = "./Dots/index.html";
  });
}
