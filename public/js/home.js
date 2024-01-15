const modal = document.getElementById("modal")
const simpleLevel = document.getElementById("simple-level")
const btnContainer = document.getElementById("btn-container")
const operatingLevel = document.getElementById("operating-level")

var currentServerLevel = null
var currentClientLevel = null
var openInterval
var closedInterval

const backgroundImg = document.getElementById("background")


async function getData() {
    try {
        const response = await fetch('/get/simpleLevel');
        const data = await response.json();
        if (currentServerLevel == null || parseInt(data) != currentServerLevel) {
            modalOpen(parseInt(data))
            currentServerLevel = parseInt(data)
        }
        console.log(data)
    } catch (error) {
        console.log(error)
        simpleLevel.innerText = error
    }
}

async function getClientLevel() {
    try {
        const response = await fetch('/get/operatingLevel');
        const data = await response.json()
        backgroundImg.src = "../assets/Homescreen" + data + ".png"
        return parseInt(data)
    } catch (error) {
        console.log(error)
        return -1
    }
}

async function postData(data) {
    try {
        const response = await fetch("/post", {
            method: "POST",
            mode: "cors",
            cache: "no-cache",
            credentials: "same-origin",
            headers: {
                "Content-Type": "application/json",
            },
            redirect: "follow",
            referrerPolicy: "no-referrer",
            body: JSON.stringify({ "response-level": data + "" }),
        });
        const dataResponse = await response.json();
        console.log(dataResponse)
        currentClientLevel = data
        backgroundImg.src = "../assets/Homescreen" + currentClientLevel + ".png"
    } catch (error) {
        console.log(error)
    }
}

(async () => { currentClientLevel = await getClientLevel() })()
closedInterval = setInterval(getData, 1000)

function modalOpen(level) {
    document.querySelectorAll("#modal-exit").forEach(e => e.remove())
    document.querySelectorAll("#modal-overlay").forEach(e => e.remove())
    document.querySelectorAll(".oLevelOption").forEach(e => e.remove())

    clearInterval(closedInterval)

    openInterval = setInterval(() => {
        postData(level)
        modalClose();
    }, 30000)

    let modalExit = document.createElement("div")
    modalExit.id = "modal-exit"
    modalExit.innerHTML = "&times;"
    modalExit.addEventListener("click", () => {
        if (currentClientLevel > level) {
            postData(level)
        }
        modalClose();
    })

    let modalOverlay = document.createElement("div")
    modalOverlay.id = "modal-overlay"
    modalOverlay.classList.add("active")
    modalOverlay.addEventListener("click", () => {
        if (currentClientLevel > level) {
            postData(level)
        }
        modalClose();
    })

    modal.appendChild(modalExit)
    document.body.appendChild(modalOverlay)

    for (let i = 0; i <= level; i++) {
        let button = document.createElement("button")
        button.id = "level" + i
        button.type = "submit"
        button.classList.add("oLevelOption")
        button.innerText = i
        button.name = "response-level"
        button.value = i
        if (i < level) {
            button.style.marginRight = "10px"
        }
        btnContainer.appendChild(button)
        button.addEventListener("click", () => {
            postData(i)
            modalClose();
        })
    }

    simpleLevel.innerText = "Level " + level
    operatingLevel.innerText = "Current Operating Level: " + currentClientLevel
    modal.classList.add("open")
    modal.classList.remove("close")
}

function modalClose() {
    clearInterval(openInterval)
    closedInterval = setInterval(getData, 1000)
    modal.classList.remove("open")
    modal.classList.add("close")
    document.getElementById("modal-overlay").classList.remove("active")
}