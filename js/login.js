function register(username, password) {
    fetch("http://localhost:3000/api/register", {
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
