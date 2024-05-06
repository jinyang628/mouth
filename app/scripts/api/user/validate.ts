
import { ValidateInput, ValidateResponse, validateInputSchema, validateResponseSchema } from "../../../src/types/user/validate"
import axios from "axios";

export async function validate(validateInput: ValidateInput): Promise<ValidateResponse> {

    const validatedInput = validateInputSchema.parse(validateInput);

    try {
        const response = await axios.get(
            `${validatedInput.STOMACH_API_URL}/api/user/validate/${validatedInput.API_KEY}`, 
        );
        console.log(response)
        const parsedResponse = validateResponseSchema.parse({
            status: response.status
        });
        return parsedResponse;
    } catch (error: any) {
        if (error.response && error.response.status === 401) {
            const parsedError = validateResponseSchema.parse({
                status: error.response.status
            })
            return parsedError;
        }
        throw error;
    }
    
}
