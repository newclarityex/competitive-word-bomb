const pages = ["main-menu", "ingame"];

function switchPage(page) {
    for (let i = 0; i < pages.length; i++) {
        const element = document.getElementById(pages[i]);
        if (element.id == page) {
            element.style.display = "block";
            setTimeout(() => {
                element.style.opacity = 1;
            }, 1);
        } else {
            if (element.id != "main-menu") {
                element.style.opacity = "0";
                setTimeout(() => {
                    element.style.display = "none";
                }, 500);
            }
        }
    }
}

switchPage("main-menu");
