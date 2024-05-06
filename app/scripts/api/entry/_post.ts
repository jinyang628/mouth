import axios from 'axios';

// Function to make the POST request
export async function post(shareGptLinks: string[], STOMACH_API_URL: string, API_KEY: string) {
    try {
        console.log("Making POST request with links:", shareGptLinks)
        // TEST WITH FIRST LINK TODO: TALK TO SHAWN AND DECIDE HOW MANY LINKS WE PASS IN/HOW TO REDIRECT USER
        const link: string = shareGptLinks[0];
        const response = await axios.post(
            `${STOMACH_API_URL}/api/entry`, 
            {
                api_key: API_KEY,
                url: link,
                tasks: ["summarise"]
            }
        );
        console.error(response)
        return response.data;
    } catch (error) {
        throw new Error(`Error making POST request: ${error}`);
    }
}
