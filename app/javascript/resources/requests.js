export async function postRequest(data, url, callback) {
  let response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-CSRF-TOKEN': document.querySelector('[name=csrf-token]').content,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const message = `An error has occurred: ${response.statusText}`;
    window.alert(message);
    return;
  }

  response = await response.json();

  callback(response);
}

export async function getRequest(url, callback) {
  let response = await fetch(url);

  if (!response.ok) {
    const message = `An error has occurred: ${response.statusText}`;
    window.alert(message);
    return;
  }

  response = await response.json();

  callback(response);
}
