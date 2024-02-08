const imageswrapper = document.querySelector(".images");
const loadmorebtn = document.querySelector(".load-more")
const searchinput = document.querySelector(".search-box input")
const lightBox = document.querySelector(".lightbox")
const lightBoxclose = lightBox.querySelector(".uil-times")
const downloadlightboximg = lightBox.querySelector(".uil-import")

const key = "i2NSHy1sQ1IOsHFYzFuqCLXrfZ1j5BqtsMttKwBVQ7q0j8JC5atk4E4u"
const imagesonpages = 12
let currentimages = Math.floor(Math.random() * 300) + 1;
searchterm = null

const downloadimage = (imgURL) => {
    fetch(imgURL)
        .then(res => res.blob())
        .then(file => {
            const a = document.createElement("a");
            a.href = URL.createObjectURL(file);
            a.download = new Date().getTime();
            a.click();
        }).catch(() => alert("Failed to download image!"))
}

const showlightbox = (name, img) => {
    lightBox.querySelector("img").src = img;
    lightBox.querySelector("span").innerText = name;
    downloadlightboximg.setAttribute("data-img", img)
    lightBox.classList.add("show");
    document.body.style.overflow = "hidden"
}

const downloadlightbox = (e) => { downloadimage(e.target.dataset.img) }


const closelightbox = () => {
    lightBox.classList.remove("show")
    document.body.style.overflow = "auto"
}

const getHTML = (images) => {
    imageswrapper.innerHTML += images.map(img =>
        ` <li class="card" onclick = "showlightbox('${img.photographer}', '${img.src.large2x}')">
        <img src="${img.src.large2x}" alt="img">

        <div class="details">
            <div class="photographer">
                <i class="uil uil-camera"></i>
                <span>${img.photographer}</span>
            </div>
            <button onclick = "downloadimage('${img.src.large2x}')">
                <i class="uil uil-import"></i>
            </button>
        </div>   
    </li>`
    ).join("");
}

const getimages = (apiURL) => {
    loadmorebtn.innerText = "Loading... Pls wait"
    loadmorebtn.classList.add("disabled")
    fetch(apiURL, {
        headers: { Authorization: key }
    })
        .then(response => response.json())
        .then(data => {
            getHTML(data.photos);
            loadmorebtn.innerText = "Load More"
            loadmorebtn.classList.remove("disabled")
        })
        .catch(() => alert("Failed to load images!"))
}

const loadmoreimages = () => {
    currentimages++
    let apiURL = `https://api.pexels.com/v1/curated?page=${currentimages}&per_pages=${imagesonpages}`
    apiURL = searchterm ? `https://api.pexels.com/v1/search?query=${searchterm}&page=${currentimages}&per_pages=${imagesonpages}` : apiURL
    getimages(apiURL)
}

const loadsearchimages = (e) => {
    if (e.target.value === "") return searchterm = null
    if (e.key === "Enter") {
        currentimages = 1
        searchterm = e.target.value
        imageswrapper.innerHTML = ""
        getimages(`https://api.pexels.com/v1/search?query=${searchterm}&page=${currentimages}&per_pages=${imagesonpages}`);
    }
}


getimages(`https://api.pexels.com/v1/curated?page=${currentimages}&per_pages=${imagesonpages}`);
loadmorebtn.addEventListener("click", loadmoreimages)
searchinput.addEventListener("keyup", loadsearchimages)
lightBoxclose.addEventListener("click", closelightbox)
downloadlightboximg.addEventListener("click", downloadlightbox)

let btn = document.getElementById("btn")
let btntext = document.getElementById("btn-text")
let btnimg = document.getElementById("btn-img")

btn.onclick = () => {
    document.body.classList.toggle("dark-theme")
    if (document.body.classList.contains("dark-theme")) {
        btnimg.src = "images/sun.png"
        btntext.innerHTML = "Light Mode"
    } else{
        btnimg.src = "images/moon.png"
        btntext.innerHTML = "Dark Mode"
    }
}