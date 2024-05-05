import axios from 'axios';
// Function to make the POST request
export async function post(shareGptLinks: string[]) {
    try {
        // TEST WITH FIRST LINK
        const link: string = shareGptLinks[0];
        const STOMACH_API_URL = process.env.STOMACH_API_URL;
        if (!STOMACH_API_URL) {
            throw new Error('STOMACH_API_URL is not defined');
        }
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
