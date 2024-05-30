const generateForm = document.querySelector(".generate-form");
const generateBtn = document.querySelector(".generate-btn");
const imageGallery = document.querySelector(".image-gallery");
const imgStyleSelect = document.querySelector('.img-style-select');
const previewImagesContainer = document.querySelector('.preview-images');
const themeToggle = document.getElementById('toggle-theme');
const body = document.body;

const UNSPLASH_ACCESS_KEY = "LLfhGxPrt3tHaULEdLX7deRx6m1xymiAOpfcwUHvbFA"; //  Unsplash access key here
const UNSPLASH_API_URL = `https://api.unsplash.com/search/photos?client_id=${UNSPLASH_ACCESS_KEY}&query=`;

let isImageGenerating = false;

const updateImageCard = (imageDataArray) => {
  imageDataArray.forEach((imageObject, index) => {
    const imgCard = imageGallery.querySelectorAll(".img-card")[index];
    const imgElement = imgCard.querySelector("img");
    const downloadBtn = imgCard.querySelector(".download-btn");

    // Set the image source to the Unsplash image URL
    const unsplashImageUrl = imageObject.urls.regular;
    imgElement.src = unsplashImageUrl;

    // When the image is loaded, remove the loading class and set download attributes
    imgElement.onload = () => {
      imgCard.classList.remove("loading");
      downloadBtn.setAttribute("href", unsplashImageUrl);
      downloadBtn.setAttribute("download", `${new Date().getTime()}.jpg`);
    }
  });
}

const generateImagesFromUnsplash = async (userPrompt, userImgQuantity) => {
  try {
    // Fetch images from Unsplash based on user input query
    const response = await fetch(`${UNSPLASH_API_URL}${userPrompt}&per_page=${userImgQuantity}`);

    // Throw an error message if the API response is unsuccessful
    if (!response.ok) throw new Error("Failed to fetch images from Unsplash.");

    const data = await response.json(); // Get data from the response
    updateImageCard(data.results);
  } catch (error) {
    alert(error.message);
  } finally {
    generateBtn.removeAttribute("disabled");
    generateBtn.innerText = "Generate";
    isImageGenerating = false;
  }
}

const handleImageGeneration = (e) => {
  e.preventDefault();
  if (isImageGenerating) return;

  // Get user input and image quantity values
  const userPrompt = e.target.querySelector('.prompt-input').value;
  const userImgQuantity = parseInt(e.target.querySelector('.img-quantity').value);

  // Disable the generate button, update its text, and set the flag
  generateBtn.setAttribute("disabled", true);
  generateBtn.innerText = "Generating";
  isImageGenerating = true;

  // Creating HTML markup for image cards with loading state
  const imgCardMarkup = Array.from({ length: userImgQuantity }, () =>
    `<div class="img-card loading">
        <img src="loader.svg" alt="Unsplash image">
        <a class="download-btn" href="#">
          <img src="download.svg" alt="download icon">
        </a>
      </div>`
  ).join("");

  imageGallery.innerHTML = imgCardMarkup;
  generateImagesFromUnsplash(userPrompt, userImgQuantity);
}

generateForm.addEventListener("submit", handleImageGeneration);

generateForm.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    handleImageGeneration(event);
  }
});


themeToggle.addEventListener('click', () => {
  body.classList.toggle('dark-mode');
});
