const getFbVideoInfo = require("fb-downloader-scrapper");

async function fetchFbVideoDetails(videoLink) {
    try {
        // Fetch video information from Facebook
        const result = await getFbVideoInfo(videoLink);
        
        // Check if the result contains SD and HD video URLs
        const sdVideo = result.sd;
        const hdVideo = result.hd;

        // Return the video details
        return {
            sdVideo,
            hdVideo
        };
    } catch (error) {
        console.error('Error fetching Facebook video details:', error);
        return null; // Return null in case of error
    }
}

module.exports = {
    fetchFbVideoDetails
};
