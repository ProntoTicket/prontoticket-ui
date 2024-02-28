import { useRouter } from 'next/router';
import { useEffect } from 'react';
import Layout from '../layout';

// Define the SuccessPage component
const SuccessPage = () => {
  // Access router to get transaction confirmation number from the URL
  const router = useRouter();
  const { transactionId } = router.query;

  // Define useEffect hook to call the /generate endpoint when the component mounts
  useEffect(() => {
    // Define a function to call the /generate endpoint
    const completeTransaction = async () => {
      try {
        // Make a POST request to the backend endpoint
        const response = await fetch(
          `http://localhost:5110/api/tickets/generate`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ Confirmation: transactionId }), // Pass the transaction confirmation number
          }
        );

        // Check if the response is successful
        if (!response.ok) {
          // If response is not ok, throw an error with the status text
          throw new Error(`Failed to generate tickets: ${response.statusText}`);
        }

        // Parse the JSON response body
        const tickets = await response.json();

        // Log success message and the tickets if the transaction is completed successfully
        console.log(
          'Transaction completed successfully, tickets generated:',
          tickets
        );
      } catch (error) {
        console.error('Error completing transaction:', error);
      }
    };

    // Call the completeTransaction function
    if (transactionId) {
      completeTransaction();
    }
  }, [transactionId]); // Run the effect only when transactionId changes

  // Return the UI of the success page
  return (
    <Layout>
      <div
        className="mx-auto mt-24"
        style={{ minWidth: '800px', maxWidth: '800px', maxHeight: '800px' }}
      >
        <div
          className="overflow-hidden rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark"
          style={{ minHeight: 'auto' }}
        >
          <div className="relative px-4 pb-6 text-center lg:pb-8 xl:pb-11.5">
            <h2 className="text-1xl md:text-2xl font-extrabold leading-tighter tracking-tighter mb-10 mt-16">
              Pronto
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-teal-400">
                Ticket
              </span>
            </h2>
            <h2 className="text-1xl md:text-2xl font-extrabold leading-tighter trackinga-tighter mb-10 mt-16">
              Your Order Has Been Successful
            </h2>
          </div>
        </div>
      </div>
    </Layout>
  );
};

// Export the SuccessPage component
export default SuccessPage;
