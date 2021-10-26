function register(username, password, email) {
    let params = {
        username,
        password,
    };
    if (email) {
        params.email = email;
    }
    fetch("http://localhost:3000/api/register", {
        method: "post",
        headers: {
            Accept: "application/json, text/plain, */*",
            "Content-Type": "application/json",
        },
        body: JSON.stringify(params),
    }).then((res) => {
        if (res.status == 200) {
            res.json().then((data) => {
                localStorage.setItem("username", data.username);
                localStorage.setItem("id", data.id);
                location.reload();
            });
            return;
        }
        res.text().then((data) => alert(data));
    });
}

function login(username, password) {
    fetch("http://localhost:3000/api/login", {
        method: "post",
        headers: {
            Accept: "application/json, text/plain, */*",
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            username,
            password,
        }),
    }).then((res) => {
        if (res.status == 200) {
            res.json().then((data) => {
                localStorage.setItem("username", data.username);
                localStorage.setItem("id", data.id);
                location.reload();
            });
            return;
        }
        res.text().then((data) => alert(data));
    });
}

function logout() {
    fetch("http://localhost:3000/api/logout", {
        method: "post",
    }).then((res) => {
        localStorage.removeItem("username");
        localStorage.removeItem("id");
        location.reload();
    });
}

const authModalWrapper = document.getElementsByClassName("auth-modal")[0];
const modalBoxes = document.getElementsByClassName("modal-box");
const loginModal = document.getElementsByClassName("modal-box login")[0];
const registerModal = document.getElementsByClassName("modal-box register")[0];

function closeAuthModal() {
    authModalWrapper.style.opacity = "0";
    setTimeout(() => {
        authModalWrapper.style.display = "none";
    }, 300);
}

function openModal(modal) {
    authModalWrapper.style.display = "grid";
    setTimeout(() => {
        authModalWrapper.style.opacity = "1";
    }, 1);
    for (let i = 0; i < modalBoxes.length; i++) {
        const element = modalBoxes[i];
        if (element.classList.contains(modal)) {
            element.style.display = "grid";
        } else {
            element.style.display = "none";
        }
    }
}

loginModal.addEventListener("submit", submitLogin, true);
function submitLogin(e) {
    e.preventDefault();
    let username = loginModal.getElementsByClassName("auth-input")[0].value;
    let password = loginModal.getElementsByClassName("auth-input")[0].value;
    login(username, password);
}

registerModal.addEventListener("submit", submitRegister, true);
function submitRegister(e) {
    e.preventDefault();
    let username = registerModal.getElementsByClassName("auth-input")[0].value;
    let email = registerModal.getElementsByClassName("auth-input")[1].value;
    let password = registerModal.getElementsByClassName("auth-input")[2].value;
    register(username, password, email);
}

// Set login status
var userData
var username = localStorage.getItem("username");
var user_id = localStorage.getItem("id");
if (username) {
    updateUserData();
    let usernameSpan = document.getElementsByClassName("navbar-username")[0];
    usernameSpan.textContent = username;
    let userDiv = document.getElementsByClassName("navbar-user")[0];
    userDiv.style.display = "block";
    setTimeout(() => {
        userDiv.style.opacity = "1";
    }, 1);
} else {
    // Show login buttons
    let buttonsWrapper = document.getElementsByClassName(
        "navbar-buttons-wrapper"
    )[0];
    buttonsWrapper.style.display = "flex";
    setTimeout(() => {
        buttonsWrapper.style.opacity = "1";
    }, 1);

    // Disable competitive
    document.getElementById("competitive-locked").style.display = "grid";
    setTimeout(() => {
        document.getElementById("competitive-locked").style.opacity = "1";
    }, 1);
}

function updateUserData() {
    fetch(`http://localhost:3000/api/user?username=${username}`).then((res) => {
        if (res.status == 200) {
            res.json().then((data) => {
                userData = data
            });
            return;
        }
    });
}
