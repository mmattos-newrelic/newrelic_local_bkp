const fs = require('fs');
const fetch = require('node-fetch');

const filePath = '<path of your backup output here>/bkp_output.json';
const url = 'https://insights-collector.newrelic.com/v1/accounts/<your account ID here>/events';
const licenseKey = '<your license key here>';

fs.readFile(filePath, 'utf8', async (err, data) => {
  if (err) {
    console.error('Error reading file:', err);
    return;
  }

  // Split the JSON content into lines
  let lines = data.split('\n');

  // Remove the first 4 lines and the last 5 lines
  lines = lines.slice(4, -5);

  // Find and modify occurrences of "agentName"
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('agentName')) {
      // Insert eventType before agentName
      const spaceCount = lines[i].indexOf('agentName');
      const spaces = ' '.repeat(spaceCount);
      lines.splice(i, 0, `${spaces}"eventType": "processSampleBkp",`);
      i++; // Move to the next line after inserting eventType
    }

    // Remove lines containing "timestamp"
    if (lines[i].includes('timestamp')) {
      lines.splice(i, 1);
      i--; // Adjust index after removing a line
    }
  }

  // Add brackets at the beginning and end of the modified content
  lines.unshift('[');
  lines.push(']');

  // Join the lines to form the updated content
  const updatedContent = lines.join('\n');

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-License-Key': licenseKey,
      },
      body: updatedContent,
    });

    const responseData = await response.json();
    console.log('JSON posted successfully:', responseData);
  } catch (error) {
    console.error('Error posting JSON:', error);
  }
});
