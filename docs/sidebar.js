function openNav() {
    document.getElementById("mySidebar").style.width = "500px";
    document.getElementById("navbutton").style.marginLeft = "500px";
}
        
function closeNav() {
  document.getElementById("mySidebar").style.width = "0";
  document.getElementById("navbutton").style.marginLeft= "0";
}

function toggleNav() {
  const element = document.getElementById("mySidebar");
  const navb = document.getElementById("navbutton");
  if (element.style.width == "500px" && navb.style.marginLeft == "500px") {
      element.style.width = "0px";
      navb.style.marginLeft= "0";
  } else {
      element.style.width = "500px";
      navb.style.marginLeft = "500px";
  }
}