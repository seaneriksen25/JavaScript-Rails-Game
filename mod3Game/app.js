document.addEventListener("DOMContentLoaded", () => {

    const usersURL = "http://localhost:3000/users";
    const winsURL = "http://localhost:3000/wins";
    const lossesURL = "http://localhost:3000/losses";

    const resetButton = document.getElementById("reset");
    const signupBtn = document.getElementById("signupBtn");
    const loginBtn = document.getElementById("loginBtn");
    const bodyDiv = document.getElementById("game-body");
    const modeButtons = document.getElementsByClassName("mode");
    const squares = document.getElementsByClassName("square");
    const colorDisplay = document.getElementById("colorDisplay");

    let numSquares = 0;
    let colors = [];
    let clickArray = [];
    let pickedColor;
    let loggedIn = false;
    let colorBoxDiv = document.getElementById("container");
    let easy = document.getElementById("easy");
    let medium = document.getElementById("medium");
    let hard = document.getElementById("hard");
    let currentUser;
    let difficulty = { gameMode: "" }; 
    let gameSquare = event.currentTarget;
    // Set up the ability to count how many clicks you've made on the gameboard.
    // Making this global so that the reset function has access to it.
    let clicks = gameSquare.clicks = (gameSquare.clicks || 0) + 1;
    clickArray.push(clicks);
    // let getUsersBtn = document.getElementById("getUsersBtn");

   
    class App {

        static init() {
            setupModeButtons();
            setupSquares();
            reset();
            startScreen();
        }   
    }

    function modalHandler(event) {
        let modal = document.getElementById("modal");
        let modalExit = document.getElementById("exit");
        let modalGreeting = document.getElementById("modalGreeting");
        let usernameLabel = document.getElementById("usernameLabel");
        let usernameInput = document.getElementById("usernameInput");
        let passwordLabel = document.getElementById("passwordLabel");
        let passwordInput = document.getElementById("passwordInput");
        let submit = document.getElementById("submit");
        let modalFooter = document.getElementById("modalSendOff");
        let editProfileBtn = document.getElementById("editProfileBtn");

        if (event.target === signupBtn) {
            modal.style.display = "block";
            modalGreeting.innerText = "Welcome, Let's get you started!";
            usernameLabel.innerText = "Please enter a username.";
            usernameInput.value;
            passwordLabel.innerText = "Please enter a password.";
            passwordInput.value;
            submit.innerText = "Submit";
            modalFooter.innerText = "Good luck on your guessing!";
            modal.addEventListener("submit", createUser);
           
        } else if (event.target === loginBtn) {
            modal.style.display = "block";
            modalGreeting.innerText = "Welcome back, Let's start guessing!";
            usernameLabel.innerText = "Please enter your username.";
            usernameInput.value;
            passwordLabel.innerText = "Please enter your password.";
            passwordInput.value;
            submit.innerText = "Submit";
            modalFooter.innerText = "May the odds be ever in your favor!";
            modal.addEventListener("submit", loginUser); 

        } else if (event.target === rulesModal) {
            modal.style.display = "block";
            modalGreeting.innerText = "The rules are pretty simple. On Easy mode you have two guesses " +
                "to find the chosen color or else you lose and on Medium/Hard mode you have three guesses."
                usernameLabel.style.display = "none";
                usernameInput.style.display = "none";
                passwordLabel.style.display = "none";
                passwordInput.style.display = "none";
                submit.style.display = "none";
            
        } else if (event.target === editProfileBtn) {
            modal.style.display = "block";
            modalGreeting.innerText = "Edit your information.";
            usernameLabel.innerText = "Enter a new username.";
            usernameInput.value;
            passwordLabel.innerText = "Enter a new password";
            passwordInput.value;
            submit.innerText = "Submit";
            modalFooter.innerText = "Change is good ;)";

        } else if (event.target === modalExit) {
            modalExit.addEventListener("click", function() {
                modal.style.display = "none";
            })
        } else {
            window.addEventListener("click", function(event) {
                if (event.target == modal) {
                    modal.style.display = "none";
                }
            }) 
        }
    }


    function createUser(event) {
        event.preventDefault();
        let modal = document.getElementById("modal");

        fetch(usersURL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json"
            },
            body: JSON.stringify({
                username: usernameInput.value,
                password: passwordInput.value

            })
        })
            .then(response => response.json())
            .then(user => {
                window.localStorage.clear();
                window.localStorage.id = user.id;
                currentUser = user;
                renderUser(currentUser);
                loggedIn = true;
                event.target.reset();
                modal.style.display = "none"
                loginBtn.style.display = "none";
                signupBtn.style.display = "none";
                startScreen();
                // getUsers();
                // return currentUser;
            })
    }

    function loginUser(event) {
        event.preventDefault();
        let usernameInput = document.getElementById("usernameInput");
        let modal = document.getElementById("modal");

        fetch(usersURL)
        .then(response => response.json())
        .then(users => {
            // for(const user of users) {
            //     if (user.username === usernameInput.value) {
            //         localStorage.id = user.id
            //         currentUser = user
            //         loggedIn = true
            //         console.log(currentUser)
            //         renderUser(currentUser)
            //         event.target.reset();
            //         modal.style.display = "none";
            //         loginBtn.style.display = "none";
            //         signupBtn.style.display = "none";
            //         startScreen();
            //         return currentUser
            //     }
            // }
            let user = users.find(function(user){
                return user.username === usernameInput.value;
            })
            if (user) {
                currentUser = user;
                window.localStorage.id = user.id;
                loggedIn = true;
                // console.log("You are logged in as...");
                // console.log(currentUser);
                renderUser(currentUser);
                event.target.reset();
                modal.style.display = "none";
                loginBtn.style.display = "none";
                signupBtn.style.display = "none";
                startScreen();
                
            }
        })
    }
   

    function renderUser(user) {
        fetch(`http://localhost:3000/users/${user.id}`)
        .then(response => response.json())
        .then(user => {
            // console.log("Now rendering profile for...");
            // console.log(user);
            renderUserProfile(user);
            // displayOtherUsers(user)
        })
    }

    // function renderOtherUsers(user) {
    //     fetch(`http://localhost:3000/users/${user.id}`)
    //         .then(response => response.json())
    //         .then(user => {
    //             console.log(user)
    //             // renderUserProfile(user)
    //             displayOtherUsers(user)
    //         })
    // }
   

    // function getUsers() {
    //     fetch(usersURL)
    //         .then(response => response.json())
    //         .then(users => {
    //             console.log(users)
    //             for (const user of users) {
    //                     // usersIndex(user)
    //                 // renderUser(user)
    //                 // renderUserProfile(user)
    //                 renderOtherUsers(user)
                
    
    //             }
    //         })
    // }

    
function renderUserProfile(user) {

    let userProfileDiv = document.createElement("div");
    userProfileDiv.id = user.id;
    userProfileDiv.className = "userProfile";
    let usernameDisplayDiv = document.createElement("div");
    usernameDisplayDiv.id = "usernameDisplayDiv";
    let usernameDisplay = document.createElement("p");
    usernameDisplay.id = "usernameDisplay";
    usernameDisplay.className = "usernameDisplay";
    usernameDisplay.innerText = user.username;
    let scoreDisplayDiv = document.createElement("div");
    scoreDisplayDiv.id = "scoreDisplayDiv";
    let scoreDisplay = document.createElement("p");
    scoreDisplay.className = "scoreDisplay";
    scoreDisplay.innerText = "Scoreboard";
    let winsAndLossesDiv = document.createElement("div");
    winsAndLossesDiv.id = "winsAndLosses";
    let winDisplay = document.createElement("p");
    winDisplay.className = "winDisplay";
    winDisplay.innerText = "Wins:";
    let winsSpan = document.createElement("span");
    winsSpan.id = "winSpan";
    winsSpan.innerText = user.wins.length;
    let lossDisplay = document.createElement("p");
    lossDisplay.className = "lossDisplay";
    lossDisplay.innerText = "Losses:";
    let lossSpan = document.createElement("span");
    lossSpan.id = "lossSpan";
    lossSpan.innerText = user.losses.length;
    let rulesModal = document.createElement("h5");
    rulesModal.id = "rulesModal";
    rulesModal.innerText = "Rules";
    let editProfileBtn = document.createElement("h5");
    editProfileBtn.id = "editProfileBtn";
    editProfileBtn.innerText = "Edit Profile";
    let deleteProfileBtn = document.createElement("h5");
    deleteProfileBtn.id = "deleteProfileBtn";
    deleteProfileBtn.innerText = "Delete Profile";
    let logoutBtn = document.createElement("h5");
    logoutBtn.id = "logoutBtn";
    logoutBtn.innerText = "Logout";


    usernameDisplayDiv.appendChild(usernameDisplay);
    userProfileDiv.appendChild(usernameDisplayDiv);
    scoreDisplayDiv.appendChild(scoreDisplay);
    userProfileDiv.appendChild(scoreDisplayDiv);
    winDisplay.appendChild(winsSpan);
    lossDisplay.appendChild(lossSpan);
    winsAndLossesDiv.appendChild(winDisplay);
    winsAndLossesDiv.appendChild(lossDisplay);
    userProfileDiv.appendChild(winsAndLossesDiv);
    userProfileDiv.appendChild(rulesModal);
    userProfileDiv.appendChild(editProfileBtn);
    userProfileDiv.appendChild(deleteProfileBtn);
    userProfileDiv.appendChild(logoutBtn);
    bodyDiv.appendChild(userProfileDiv);

    deleteProfileBtn.addEventListener("click", (event) => {
        fetch(`http://localhost:3000/users/${user.id}`, {
            method: "DELETE",
        })
        loggedIn = false;
        event.target.parentNode.remove();
        window.localStorage.clear();
        window.location.reload(true);
        startScreen();
})
    modal.addEventListener("submit", (event) => {
        event.preventDefault();
        let modal = document.getElementById("modal");
        let usernameInput = document.getElementById("usernameInput");
        let passwordInput = document.getElementById("passwordInput");

        fetch(`http://localhost:3000/users/${user.id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json"
            },
            body: JSON.stringify({
                username: usernameInput.value,
                password: passwordInput.value
            })
        })
            .then(response => response.json())
            .then(editedUser => {
                renderUser(editedUser);
                event.target.reset();
                modal.style.display = "none";
            })
    });

    logoutBtn.addEventListener("click", () => {
        window.localStorage.clear();
        window.location.reload(true);
        loggedIn = false;
        startScreen();
        userProfileDiv.classList.add("hidden");
    })
}


    // function displayOtherUsers(user) {
    //     let usersIndexDiv = document.createElement("div");
    //     usersIndexDiv.id = "usersIndex";
    //     usersIndexDiv.className = "usersIndex";
    //     let usernamesDisplayDiv = document.createElement("div");
    //     usernamesDisplayDiv.id = "usernamesDisplayDiv";
    //     let usernamesDisplay = document.createElement("p");
    //     usernamesDisplay.id = "usernamesDisplay";
    //     usernamesDisplay.className = "usernamesDisplay";
    //     usernamesDisplay.innerText = user.username
    //     let usersIndexDisplayBodyDiv = document.createElement("div");
    //     usersIndexDisplayBodyDiv.id = "usersIndexDisplayBody"
    //     let scoreDisplayDiv = document.createElement("div");
    //     scoreDisplayDiv.id = "scoreDisplayDiv";
    //     let scoreDisplay = document.createElement("p");
    //     scoreDisplay.className = "scoreDisplay"
    //     scoreDisplay.innerText = "Scoreboard";
    //     let winsAndLossesDiv = document.createElement("div");
    //     winsAndLossesDiv.id = "winsAndLosses";
    //     let winDisplay = document.createElement("p");
    //     winDisplay.className = "winDisplay";
    //     winDisplay.innerText = "Wins:";
    //     let winsSpan = document.createElement("span");
    //     winsSpan.id = "winSpan";
    //     winsSpan.innerText = user.wins.length;
    //     let lossDisplay = document.createElement("p");
    //     lossDisplay.className = "lossDisplay";
    //     lossDisplay.innerText = "Losses:";
    //     let lossSpan = document.createElement("span");
    //     lossSpan.id = "lossSpan";
    //     lossSpan.innerText = user.losses.length;
    //     let goBackBtn = document.createElement("h5");
    //     goBackBtn.id = "goBackBtn";
    //     goBackBtn.innerText = "Go Back";
        
    //     usernamesDisplayDiv.appendChild(usernamesDisplay);
    //     usersIndexDiv.appendChild(usernamesDisplayDiv);
    //     scoreDisplayDiv.appendChild(scoreDisplay);
    //     usersIndexDisplayBodyDiv.appendChild(scoreDisplayDiv);
    //     winDisplay.appendChild(winsSpan);
    //     lossDisplay.appendChild(lossSpan);
    //     winsAndLossesDiv.appendChild(winDisplay);
    //     winsAndLossesDiv.appendChild(lossDisplay);
    //     usersIndexDisplayBodyDiv.appendChild(winsAndLossesDiv);
    //     usersIndexDisplayBodyDiv.appendChild(goBackBtn);
    //     usersIndexDisplayBodyDiv.classList.toggle("hidden");
    //     usersIndexDiv.classList.toggle("hidden");
    //     usersIndexDiv.appendChild(usersIndexDisplayBodyDiv);
    //     bodyDiv.appendChild(usersIndexDiv);
    // }

    // let usersIndexDiv = document.createElement("div");
    // let usernamesDisplayDiv = document.createElement("div");
    // let usernamesUL = document.createElement("ul");
    // usersIndexDiv.className = "usersIndex";
    // usernamesDisplayDiv.className = "usernamesDisplayDiv";
    // usernamesUL.className = "usernamesUL";
    // usernamesDisplayDiv.appendChild(usernamesUL);
    // usersIndexDiv.appendChild(usernamesDisplayDiv);
    // bodyDiv.appendChild(usersIndexDiv);


    // let usersIndex = (user) => {
    //     let usernamesDisplayLi = document.createElement("li");
    //     usernamesDisplayLi.className = "usernamesDisplay";
    //     usernamesDisplayLi.id = user.id;
    //     usernamesDisplayLi.innerText = user.username;
    //     usernamesUL.appendChild(usernamesDisplayLi);
    //     usersIndexDiv.addEventListener("click", displayOtherUsers)
    // }

function setupModeButtons() {
    // This is listening for a click on the difficulty buttons, will highlight the button
    // you chose and will set up the squares with the proper amount needed
    for (let i = 0; i < modeButtons.length; i++) {
      modeButtons[i].addEventListener("click", function() {
            modeButtons[0].classList.remove("selected");
            modeButtons[1].classList.remove("selected");
            modeButtons[2].classList.remove("selected");
            this.classList.add("selected");
            // this.textContent === "Easy" ? numSquares = 3 : numSquares = 6;
            // Below is an alternative if statement for this function
            if(this.textContent === "Easy") {
                numSquares = 3;
            } else if (this.textContent === "Medium") {
            	numSquares = 6;
            } else {
                numSquares = 9;
            }
            reset();
        }); 
    }
}
      
    
function setupSquares() {
    let h1 = document.querySelector("h1");
    let messageDisplay = document.getElementById("message");
    let gameSquare = event.currentTarget;

    for (let i = 0; i < squares.length; i++) {

        //Add click listeners to all the squares
        squares[i].addEventListener("click", function(event) {
            
            // Grab the color of the clicked square
            const clickedColor = this.style.backgroundColor;

            // Change the h1 background to reflect the color of the square you just clicked
            h1.style.backgroundColor = clickedColor;

            // Set up the ability to count how many clicks you've made on the gameboard
            let clicks = gameSquare.clicks = (gameSquare.clicks || 0) + 1;
            clickArray.push(clicks);

            // This is where all the games win and lose scenarios are determined aka the games functioning
            switch (difficulty.gameMode) {

                case 'Easy':
                    if (difficulty.gameMode === "Easy" && clickArray.length <= 2 && clickedColor === pickedColor) {
                        console.log("Success! You Won!");
                        messageDisplay.textContent = "You Won!";
                        resetButton.textContent = "Play Again?";
                        changeColors(clickedColor);
                        h1.style.backgroundColor = clickedColor;

                        fetch(winsURL, {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                                Accept: "application/json"
                            },
                            body: JSON.stringify({
                                user_id: currentUser.id
                            })
                        })
                            renderUser(currentUser);
                        // clickArray.length = 0;
                        gameSquare.clicks = 0;
                        console.log("Click array is at" + " " + clickArray.length);
                        window.setTimeout(reset, 3000);

                    } else if (difficulty.gameMode === "Easy" && clickArray.length > 2) {
                        console.log("You Lost!");
                        messageDisplay.textContent = "Sorry, You Lost!";
                        resetButton.textContent = "Play Again?";

                        fetch(lossesURL, {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                                Accept: "application/json"
                            },
                            body: JSON.stringify({
                                user_id: currentUser.id
                            })
                        })
                            renderUser(currentUser);
                        // clickArray.length = 0;
                        gameSquare.clicks = 0;
                        console.log("Click array is at" + " " + clickArray.length);
                        window.setTimeout(reset, 3000);
                    } else {
                        this.style.backgroundColor = "#232323";
                        messageDisplay.textContent = "Try Again!";
                    };

                    break;

                case 'Medium':
                    if (difficulty.gameMode === "Medium" && clickArray.length <= 3 && clickedColor === pickedColor) {
                        console.log("Success! You Won!")
                        messageDisplay.textContent = "You Won!";
                        resetButton.textContent = "Play Again?";
                        changeColors(clickedColor);
                        h1.style.backgroundColor = clickedColor;

                        fetch(winsURL, {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                                Accept: "application/json"
                            },
                            body: JSON.stringify({
                                user_id: currentUser.id
                            })
                        })
                        renderUser(currentUser);
                        // clickArray.length = 0;
                        gameSquare.clicks = 0;
                        console.log("Click array is at" + " " + clickArray.length);
                        window.setTimeout(reset, 3000);

                    } else if (difficulty.gameMode === "Medium" && clickArray.length > 3) {
                        console.log("You Lost!");
                        messageDisplay.textContent = "Sorry, You Lost!";
                        resetButton.textContent = "Play Again?";

                        fetch(lossesURL, {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                                Accept: "application/json"
                            },
                            body: JSON.stringify({
                                user_id: currentUser.id
                            })
                        })
                        renderUser(currentUser);
                        // clickArray.length = 0;
                        gameSquare.clicks = 0;
                        console.log("Click array is at" + " " + clickArray.length);
                        window.setTimeout(reset, 3000);
                    } else {
                        this.style.backgroundColor = "#232323";
                        messageDisplay.textContent = "Try Again!";
                    };

                    break;

                case 'Hard':
                    if (difficulty.gameMode === "Hard" && clickArray.length <= 3 && clickedColor === pickedColor) {
                        console.log("Success!");
                        messageDisplay.textContent = "You Won!";
                        resetButton.textContent = "Play Again?";
                        changeColors(clickedColor);
                        h1.style.backgroundColor = clickedColor;

                        fetch(winsURL, {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                                Accept: "application/json"
                            },
                            body: JSON.stringify({
                                user_id: currentUser.id
                            })
                        })
                        renderUser(currentUser);
                        // clickArray.length = 0;
                        gameSquare.clicks = 0;
                        console.log("Click array is at" + " " + clickArray.length);
                        window.setTimeout(reset, 3000);

                    } else if (difficulty.gameMode === "Hard" && clickArray.length > 3) {
                        console.log("You Lost!");
                        messageDisplay.textContent = "Sorry, You Lost!";
                        resetButton.textContent = "Play Again?";

                        fetch(lossesURL, {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                                Accept: "application/json"
                            },
                            body: JSON.stringify({
                                user_id: currentUser.id
                            })
                        });
                        renderUser(currentUser);
                        // clickArray.length = 0;
                        gameSquare.clicks = 0;
                        console.log("Click array is at" + " " + clickArray.length);
                        window.setTimeout(reset, 3000);
                    } else {
                        this.style.backgroundColor = "#232323";
                        messageDisplay.textContent = "Try Again!";
                    };

                    break;

                default:
                    alert("Something Went Wrong!")
                    console.log("Something is wrong with the switch case statement!");
            };
        });
    }
}


    

function reset() {
    //Generate all new colors
    colors = generateRandomColors(numSquares);

    //Pick a new random color from array
    pickedColor = pickColor();

    // Grab the h1 element for styling
    let h1 = document.querySelector("h1");
    let messageDisplay = document.getElementById("message");
    
    //Change colorDisplay to match picked color
    colorDisplay.textContent = pickedColor;
    resetButton.textContent = "New Colors";
    messageDisplay.textContent = "";

    //Change colors of squares, change the h1 back to default color, and reset the click counter back to 0
    for (let i = 0; i < squares.length; i++) {
        if (colors[i]) {
            squares[i].style.display = "block";
            squares[i].style.backgroundColor = colors[i];
        } else {
            squares[i].style.display = "none";
        }
    }
    h1.style.backgroundColor = "steelblue";
    clickArray.length = 0;
    gameSquare.clicks = 0;
    
}

// Simply check if loggedIn is true or not and either hide certain elements or display them
    function startScreen() {
        if (loggedIn === false) {
            resetButton.classList.add("hidden");
            easy.classList.add("hidden");
            medium.classList.add("hidden");
            hard.classList.add("hidden");
            signupBtn.style.display = "block";
            loginBtn.style.display = "block";
        } else if (loggedIn === true) {
            resetButton.classList.remove("hidden");
            easy.classList.remove("hidden");
            medium.classList.remove("hidden");
            hard.classList.remove("hidden");
        }
    }


function changeColors(color) {
    //Loop through all squares
    for (let i = 0; i < squares.length; i++) {
        //Change each color to match given color
        squares[i].style.backgroundColor = color;
    }
}

// Pick a random color from the generated colors
function pickColor() {
    let random = Math.floor(Math.random() * colors.length);
    return colors[random];
}

function generateRandomColors(num) {
    //Make an array
    let arr = [];
    //Repeat a certain number of times
    for (let i = 0; i < num; i++) {
        //Get random color and push into array
        arr.push(randomColor());
    }
    //Return that array
    return arr;
}

function randomColor() {
    //Pick a "Red" from 0-255
    let r = Math.floor(Math.random() * 256);
    //Pick a "Green" from 0-255
    let g = Math.floor(Math.random() * 256);
    //Pick a "Blue" from 0-255
    let b = Math.floor(Math.random() * 256);
    // "rgb(r, g, b)"
    return "rgb(" + r + ", " + g + ", " + b + ")";
}

    document.addEventListener("click", modalHandler);
    resetButton.addEventListener("click", reset);
    bodyDiv.addEventListener("click", function (event) {
        if (event.target.textContent === "Easy") {
            console.log("You're using Easy mode!");
            difficulty.gameMode = "Easy";
        } else if (event.target.textContent === "Medium") {
            console.log("You're using Medium mode!");
            difficulty.gameMode = "Medium";
        } else if (event.target.textContent === "Hard") {
            console.log("You're using Hard mode!");
            difficulty.gameMode = "Hard";
        }
    })
    // getUsersBtn.addEventListener("click", getUsers);
    // modal.addEventListener("submit", createUserFetch)
    // toggleButton.addEventListener("click", toggleBackdrop);
    App.init();
});