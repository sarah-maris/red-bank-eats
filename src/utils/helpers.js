import noImage from "../images/no-image-available.png";
import fsButton from "../images/foursquare-button.png";


  // set up fallbacks in case data is incomplete
export const checkData = (marker, data) => {
  const place = data.response.venue;

  const {
    canonicalUrl,
    bestPhoto,
    contact,
    location,
    categories,
    attributes,
    tips
  } = place; // destructuring

  marker.url = canonicalUrl ? canonicalUrl : "https://foursquare.com/";
  marker.photo = bestPhoto
    ? `${bestPhoto.prefix}width100${bestPhoto.suffix}` // ES6 template literals
    : noImage;
  marker.phone =
    contact && contact.formattedPhone ? contact.formattedPhone : "";
  marker.address = location.address;
  marker.category = categories.length > 0 ? categories[0].name : "";
  marker.price =
    attributes.groups[0].summary && attributes.groups[0].type === "price"
      ? attributes.groups[0].summary
      : "";
  marker.tip =
    tips.count > 0 ? `"${tips.groups[0].items[0].text}"` : "No tips available";

  return marker;
};


// build infowindow content
export const buildInfoContent = marker => {
  marker.infoContent = `<div class="place">
                      <img class="place-photo" src=${marker.photo} alt="${marker.title}">
                      <div class="place-meta">
                        <h2 class="place-title">${marker.title}</h2>
                        <p class="place-data">${marker.category}</p>
                        <p class="place-price">${marker.price}</p>
                        <p class="place-contact">${marker.address}</p>
                        <a class="place-phone" href="tel:${marker.phone}">${marker.phone}</a>
                      </div>
                    </div>
                    <p class="place-tip">${marker.tip}</p>
                    <a class="place-link" href="${marker.url}" target="_blank">
                      <span>Read more</span>
                      <img class="fs-link" src="${fsButton}">
                    </a>`;
  return marker;
};

// build infowindow content when there is an error
export const buildErrorContent = marker => {
  marker.infoContent = `<div class="venue-error"  role="alert">
        <h3>Foursquare Venue Details request for ${marker.title} failed</h3>
        <p>Try again later...</p>
      </div>`;
  return marker;
};
