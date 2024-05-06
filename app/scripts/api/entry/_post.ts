import axios from 'axios';

// Function to make the POST request
export async function post(shareGptLinks: string[], STOMACH_API_URL: string) {
    try {
        console.log("Making POST request with links:", shareGptLinks)
        // TEST WITH FIRST LINK
        const link: string = shareGptLinks[0];
        console.log(`${STOMACH_API_URL}/api/entry`)
        const response = await axios.post(
            `${STOMACH_API_URL}/api/entry`, 
            {
                api_key: "test_api_key_1",
                url: link,
                tasks: ["SUMMARY"]
            }
        );
        console.error(response)
        return response.data;
    } catch (error) {
        throw new Error(`Error making POST request: ${error}`);
    }
}
