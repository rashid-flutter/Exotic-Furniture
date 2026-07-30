function copyAndReview(id) {

    const text = document.getElementById(id).innerText;

    navigator.clipboard.writeText(text).then(() => {

        const toast = document.getElementById("toast");

        toast.style.display = "block";

        setTimeout(() => {

            toast.style.display = "none";

            window.location.href = GOOGLE_REVIEW_LINK;

        }, 1000);

    });

}

const GOOGLE_REVIEW_LINK = "https://g.page/r/CeKLmh_yqQCVEBE/review";

const reviews = [
    "Best furniture showroom in Palakkad. Excellent quality furniture, affordable prices, friendly staff, and on-time delivery. Highly recommended.",

    "Purchased a sofa from Exotic Furniture Palakkad. Excellent quality, smooth delivery, friendly staff, and great service. Highly recommended.",

    "Wide collection of premium furniture with many customization options. Great customer service and excellent quality. One of the best furniture stores in Palakkad.",

    "Very satisfied with my purchase. Beautiful furniture, affordable prices, quick delivery, and excellent customer support.",

    "Highly satisfied with my purchase. Premium quality furniture and professional customer service.",

    "Excellent showroom with a wide range of modern furniture. Delivery was fast and hassle-free.",

    "Affordable prices, beautiful collections, and friendly staff. Highly recommend Exotic Furniture Palakkad.",

    "Great experience from purchase to delivery. Quality products and excellent service.",

    "Very happy with my new dining table. Great finish, quality, and timely delivery.",

    "One of the best furniture showrooms in Palakkad. Quality products and outstanding customer support.",

    "Purchased a wooden cot from Exotic Furniture Palakkad. Strong build quality, elegant design, and excellent value for money. Highly recommended.",

    "Bought a mattress from Exotic Furniture. Very comfortable, premium quality, and worth every rupee. Sleeping much better now.",

    "Purchased a wardrobe from Exotic Furniture Palakkad. Excellent finish, spacious design, and smooth delivery. Very satisfied with the product.",

    "Bought an office table for my workspace. Premium quality, stylish design, and perfect finishing. Great service from the team.",

    "Purchased ergonomic office chairs for our office. Comfortable seating, excellent quality, and affordable pricing. Highly recommended.",

    "Purchased a complete bedroom set from Exotic Furniture Palakkad. Beautiful design, premium finish, and timely installation. Excellent experience.",

    "Bought an Orchid wooden sofa set. Outstanding craftsmanship, premium wood quality, and very comfortable. It has enhanced the look of our living room.",

    "Best furniture shop in Palakkad for premium collections. Huge selection of sofas, cots, wardrobes, dining tables, and office furniture at reasonable prices.",

    "Excellent customer service and a wide range of furniture. The staff helped us choose the perfect sofa and mattress. Very happy with our purchase.",

    "Exotic Furniture Palakkad is the best furniture showroom in Palakkad. Premium quality products, affordable prices, own manufacturing, and excellent after-sales service. Highly recommended."
];
const reviewList = document.getElementById("reviewList");

// Display all reviews in order (1 to 20)
reviews.forEach((review, index) => {

    reviewList.innerHTML += `
        <div class="review-card">
            <h3>Review ${index + 1}</h3>

            <div id="review${index}" class="review-text">
                ${review}
            </div>

            <button onclick="copyAndReview('review${index}')">
                ⭐ Add Your Review
            </button>
        </div>
    `;

});

function copyAndReview(id) {

    const text = document.getElementById(id).innerText;

    if (navigator.clipboard && window.isSecureContext) {

        navigator.clipboard.writeText(text)
            .then(openGoogleReview)
            .catch(fallbackCopy);

    } else {

        fallbackCopy();

    }

    function fallbackCopy() {

        const textArea = document.createElement("textarea");
        textArea.value = text;

        textArea.style.position = "fixed";
        textArea.style.left = "-9999px";

        document.body.appendChild(textArea);

        textArea.focus();
        textArea.select();

        try {

            document.execCommand("copy");
            document.body.removeChild(textArea);
            openGoogleReview();

        } catch (err) {

            document.body.removeChild(textArea);
            alert("Please copy the review manually.");

        }

    }

    function openGoogleReview() {

        const toast = document.getElementById("toast");
        toast.style.display = "block";

        setTimeout(() => {

            toast.style.display = "none";
            window.location.href = GOOGLE_REVIEW_LINK;

        }, 1000);

    }

}