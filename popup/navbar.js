// let previous = -1;
// $(".icon[data-index]").click(function(){
// 	$(this).addClass("initialised");
// 	let index = $(this).attr("data-index");
// 	let navtab = $(this).closest("nav.tab").addClass("moving").attr("data-selected", index);
// 	if(previous == -1) navtab.find('.icon[data-index="2"]').addClass("initialised")
// 	if(previous == 1 && index == 3 || previous == 3 && index == 1) { //If going from one side to the other and middle needs to be hidden
// 		navtab.find('.icon[data-index="2"]').removeClass("initialised");
// 		setTimeout(function(){ //Because apparently this is the only way it will work
// 			navtab.find('.icon[data-index="2"]').addClass("initialised"); //Same animation as the other so they line up
// 		});
// 	}  
// 	previous = index;
// 	setTimeout(function(){
// 		navtab.removeClass("moving").removeClass("hidemiddle");
// 	}, 750);
// }); 
const icons = document.querySelectorAll('.icon');

// add a click event listener to each icon
icons.forEach(icon => {
  icon.addEventListener('click', () => {
    // remove the "selected" class from all icons
    icons.forEach(icon => {
      icon.classList.remove('selected');
    });
    
    // add the "selected" class to the clicked icon
    icon.classList.add('selected');
    
    // change the color of the clicked icon to RED
    // icon.style.color = 'red';
  });
});
/*🤢 If someone knows how to sort out the animations in a non-garbage way please fork and mention in a comment, I kinda got stuck.*/