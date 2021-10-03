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
            location.reload();
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
            location.reload();
            return;
        }
        res.text().then((data) => alert(data));
    });
}

function logout() {
    fetch("http://localhost:3000/api/logout", {
        method: "post",
    }).then((res) => {
        console.log(res);
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
