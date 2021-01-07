namespace API.Errors
{
    public class ApiException
    {
        public ApiException(int statusCode, string errorMessage = null, string errorDetails = null)
        {
            StatusCode = statusCode;
            ErrorMessage = errorMessage;
            ErrorDetails = errorDetails;
        }

        public int StatusCode { get; set; }
        public string ErrorMessage { get; set; }
        public string ErrorDetails { get; set; }
    }
}