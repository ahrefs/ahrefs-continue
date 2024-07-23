interface APIError extends Error {
  response?: Response;
}

<<<<<<< HEAD
const withExponentialBackoff = async <T>(
  apiCall: () => Promise<T>,
  maxRetries = 5,
  initialDelaySeconds = 1
=======
const RETRY_AFTER_HEADER = "Retry-After";

const withExponentialBackoff = async <T>(
  apiCall: () => Promise<T>,
  maxRetries = 5,
  initialDelaySeconds = 1,
>>>>>>> v0.9.184-vscode
) => {
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const result = await apiCall();
      return result;
    } catch (error: any) {
      if (
        (error as APIError).response?.status === 429 &&
        attempt < maxRetries - 1
      ) {
<<<<<<< HEAD
        const delay = initialDelaySeconds * 2 ** attempt;
        console.log(
          `Hit rate limit. Retrying in ${delay} seconds (attempt ${
            attempt + 1
          })`
=======
        const retryAfter = (error as APIError).response?.headers.get(RETRY_AFTER_HEADER);
        const delay = retryAfter ? parseInt(retryAfter, 10) : initialDelaySeconds * 2 ** attempt;
        console.log(
          `Hit rate limit. Retrying in ${delay} seconds (attempt ${
            attempt + 1
          })`,
>>>>>>> v0.9.184-vscode
        );
        await new Promise((resolve) => setTimeout(resolve, delay * 1000));
      } else {
        throw error; // Re-throw other errors
      }
    }
  }
  throw new Error("Failed to make API call after multiple retries");
};

export { withExponentialBackoff };
