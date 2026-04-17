const fetch = require('node-fetch');

exports.handler = async function(event) {
  if(event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { image_base64 } = JSON.parse(event.body);

    const formData = new URLSearchParams();
    formData.append('image_file_b64', image_base64);
    formData.append('size', 'auto');
    formData.append('bg_color', 'ffffff');
    formData.append('format', 'jpg');

    const response = await fetch('https://api.remove.bg/v1.0/removebg', {
      method: 'POST',
      headers: {
        'X-Api-Key': '3Z24WfHgNQE3inigQV6QjFSu',
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: formData.toString()
    });

    if(!response.ok) {
      const err = await response.text();
      return { statusCode: response.status, body: JSON.stringify({ error: err }) };
    }

    const buffer = await response.buffer();
    const base64Result = buffer.toString('base64');

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ result_b64: base64Result })
    };

  } catch(err) {
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
};
