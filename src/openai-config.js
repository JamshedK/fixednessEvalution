import { Configuration, OpenAIApi } from "openai";
const configuration = new Configuration({
    organization: "org-ckyITK04BLyIhpKcFWGyUcRH",
    apiKey: process.env.REACT_APP_OPENAI_API_KEY,
});
delete configuration.baseOptions.headers['User-Agent'];

export const openai = new OpenAIApi(configuration);
