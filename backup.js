const { GraphQLClient, gql } = require('graphql-request');
const fs = require('fs');

// GraphQL endpoint URL
const endpoint = 'https://api.newrelic.com/graphql';

// Your GraphQL query
const query = gql`
  {
  actor {
    nrql(
      accounts: <your account number here>
      async: true
      query: "SELECT * FROM ProcessSample"
      timeout: 5
    ) {
      results
      totalResult
    }
  }
}
`;

// Headers to send
const headers = {
  'Content-Type': 'application/json',
  'API-Key': '<your API key here>'
};

// Create a GraphQL client with custom headers
const client = new GraphQLClient(endpoint, { headers });

// Execute the GraphQL query
client.request(query)
  .then((data) => {
    // Write the query result to a JSON file
    const filePath = '<your json file path here>/bkp_output.json'; // Replace with your desired file path
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    console.log('Query result saved to', filePath);
  })
  .catch((error) => {
    console.error('Error executing the GraphQL query:', error);
  });
