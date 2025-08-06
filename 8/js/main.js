import { generatePhotoDescriptions } from './data.js';
import { renderThumbnails } from './render-thumbnails.js';

const photos = generatePhotoDescriptions();
renderThumbnails(photos);
