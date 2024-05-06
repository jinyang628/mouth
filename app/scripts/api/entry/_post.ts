import axios from 'axios';
import { _PostInput, _postInputSchema } from '../../../src/types/entry/_post';

// Function to make the POST request
export async function post(_postInput: _PostInput) {

    const validatedInput = _postInputSchema.parse(_postInput);
    try {
        console.log("Making POST request with links:", validatedInput.shareGptLinks)
        // TEST WITH FIRST LINK TODO: TALK TO SHAWN AND DECIDE HOW MANY LINKS WE PASS IN/HOW TO REDIRECT USER
        const link: string = validatedInput.shareGptLinks[0];
        const response = await axios.post(
            `${validatedInput.STOMACH_API_URL}/api/entry`, 
            {
                api_key: validatedInput.API_KEY,
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
