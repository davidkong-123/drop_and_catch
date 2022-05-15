var left = 65;
var right = 68;
var timer;
var timer2;
var leftPress = false;
var rightPress = false;
var speed = 12;
var velocity1 = 0; // the speed of the dropping red apple
var velocity2 = 0;
var gravity = 0.25; // Gravity amount
var lives = 3;
var score = 0;
var psLock = false;
var a = 0;
var name1;
var bestScore = 0;
var trytime = 0;
//show the website first and hide the game;left and right function ready
$(document).ready(function () {
  $(".screen").hide();
  $(".screen2").hide();
  $("#website").show();
  $("#form123").show();
  //show website
  $("#play").click(function () {
    $(".screen").hide();
    //gaming screen
    $("#stage").show();
    //user name
    $("#user").show();
    //start game button
    $("#start").show();
    $("#people")
      .css({ top: $("#stage").height() - $("#people").height() })
      .css({ left: 200 });
  });
  //go to game
  //keydown function determine
  $(document).keydown(function (e) {
    if (e.which === right) {
      leftPressed = true;
    } else if (e.which === left) {
      rightPressed = true;
    }
  });
  //keyup function prevent going crazy
  $(document).keyup(function (e) {
    if (e.which === right) {
      leftPressed = false;
    } else if (e.which === left) {
      rightPressed = false;
    }
  });

  //start game
  $("#start").click(function () {
    trytime++;
    $("#start").hide();
    startGame();
  });
  //submit
  $("#submit").click(function () {
    $("#user").show();
    $("#form123").hide();
    name1 = $("#userName").val();
    $("#name span").text(name1);
  });
  // }); error

  $("#goback").click(function () {
    $(".screen").hide();
    $("#website").show();
    $("#user").show();
    clearInterval(timer);
    clearInterval(timer2);
    $("#start").show();
    $(".psApple").remove();
    $("#apple").css({ top: -50 });
    $("#apple").css({ left: Math.random() * 440 });
    velocity1 = 0;
    velocity2 = 0;
    return;
  });
});
//hide all the class of screen and show specific object
function showscreen(name) {
  $(".screen").hide();
  $(name).show();
}

//set the original data when games start and put the people in ready position
function startGame() {
  //set the life,score
  speed = 12;
  velocity1 = 0; // the speed of the dropping red apple
  velocity2 = 0;
  gravity = 0.25; // Gravity amount
  lives = 3;
  score = 0;
  a = 0;

  //people position
  $("#people")
    .css({ top: $("#stage").height() - $("#people").height() })
    .css({ left: 200 });
  //put people on the stage
  $("#score span").text(score);
  $("#lives span").text(lives);
  // Start the timer and set the interval
  timer = setInterval(update, 25);
  timer2 = setInterval(spawnpsApple, 5000);
}
//function is responsible  for detecting the collision and animation
function update() {
  //user try time
  $("#trytime span").text(trytime);
  //press function
  if (leftPressed) {
    $("#people").css({ left: "+=" + speed });
  }
  if (rightPressed) {
    $("#people").css({ left: "-=" + speed });
  }
  //set two different v
  velocity1 += gravity + a;
  velocity2 += gravity;

  //drop red apple
  if ($("#apple").position().top > $("#stage").height()) {
    $("#apple").css({ top: -50 });
    $("#apple").css({ left: Math.random() * 440 });
    velocity1 = 0;
    a += 0.01;
  } else {
    $("#apple").css({ top: "+=" + velocity1 });
    //collison for apple
    if (collisionBetween($("#apple"), $("#people"))) {
      if (!psLock) {
        psLock = true;
        score++;
        if (bestScore <= score) {
          bestScore = score;
          $("#bestScore span").text(bestScore);
        }
        $("#score span").text(score); // change the score

        //put the apple back
        $("#apple").css({ top: -50 });
        $("#apple").css({ left: Math.random() * 440 });
        velocity1 = 0;
        psLock = false;
      }
    }
  }

  //each posion apple drops seperately
  $(".psApple").each(function () {
    var velocity = Number($(this).attr("data-velocity"));
    velocity += gravity;
    $(this).attr("data-velocity", velocity);
    if ($(this).position().top > $("#stage").height()) {
      $(this).css({ top: -50 });
      $(this).css({ left: Math.random() * 440 });
      $(this).attr("data-velocity", "0");
    } else {
      $(this).css({ top: "+=" + Number($(this).attr("data-velocity")) });
      //detect the collison of posion apple and lives changes if that happens
      if (collisionBetween($(this), $("#people"))) {
        if (!psLock) {
          psLock = true;
          lives--;
          $("#lives span").text(lives);
          // reset the psapple to the top
          $(this).css({ top: -50 });
          $(this).css({ left: Math.random() * 440 });
          $(this).attr("data-velocity", "0");
          psLock = false;
          //reset
          if (lives <= 0) {
            clearInterval(timer);
            clearInterval(timer2);
            $("#start").show();
            $(".psApple").remove();
            $("#apple").css({ top: -50 });
            $("#apple").css({ left: Math.random() * 440 });
            velocity1 = 0;
            velocity2 = 0;
            return;
          }
        }
      }
    }
  });
}

//collision function to determine whether two objects are colliding
function collisionBetween(a, b) {
  var pos1 = $(a).position();
  var pos2 = $(b).position();
  return !(
    pos1.left > pos2.left + $(a).width() ||
    pos2.left > pos1.left + $(b).width() ||
    pos1.top > pos2.top + $(a).height() ||
    pos2.top > pos1.top + $(b).height()
  );
}
// spawn poison apples
function spawnpsApple() {
  var psApple = jQuery("<div/>", { class: "psApple" });
  psApple.attr("data-velocity", "1");
  // P apple into stage
  $("#stage").append(psApple);
  resetdrop(psApple);
}
//redrop the ps apple after it hit the ground
function resetdrop(e) {
  e.css({ top: -50 });
  e.css({ left: Math.random() * 440 });
}