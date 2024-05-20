import axios from 'axios';
import { _PostInput, _postInputSchema } from '../../../src/types/entry/_post';

// Function to make the POST request
export async function post(_postInput: _PostInput) {

    const validatedInput = _postInputSchema.parse(_postInput);
    try {
        console.log("Making POST request with link:", validatedInput.shareGptLink)
        const response = await axios.post(
            `${validatedInput.STOMACH_API_URL}/api/entry`, 
            {
                api_key: validatedInput.API_KEY,
                url: validatedInput.shareGptLink,
                tasks: ["summarise"]
            }
        );
        console.log("POST request response:", response.data)
        return response.data;
    } catch (error) {
        throw new Error(`Error making POST request: ${error}`);
    }
}
