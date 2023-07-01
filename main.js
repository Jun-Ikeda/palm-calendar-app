function doGet(){
    let template = HtmlService.createTemplateFromFile("index");
    return template.evaluate();
  }
  
  function getResponse(prompt) {
    const requestPayload = {
      'prompt': prompt
    }
    const requestHeaders = {
      'Content-Type': 'application/json'
    }
    const requestOptions = {
      'method' : 'post',
      'payload' : JSON.stringify(requestPayload),
      'headers' : requestHeaders
    }
    const requestUrl = 'https://us-central1-gen-lang-client-0457394073.cloudfunctions.net/palm_http';
    const response = UrlFetchApp.fetch(requestUrl, requestOptions);
    return response.getContentText();
  }
  
  function generateEvent(prompt) {
    let url = "https://www.google.com/calendar/render?action=TEMPLATE&";
    const promptTemplate = (item, isRequired = true) => 
      `Read the paragraph below about an event to add to my calendar and give an appropriate ${item}.`
      + (isRequired ? '' : ' If not applicable, answer false.');
  
    const text = getResponse(promptTemplate('title. Do not include location and date/time. ') + prompt);
    const details = getResponse(promptTemplate('description', false) + prompt);
    const location = getResponse(promptTemplate('location', false) + prompt);
    const startDate = getResponse(promptTemplate('start date/time in YYYYMMDDTHHmmSS') + prompt);
    const endDate = getResponse(promptTemplate('end date/time in YYYYMMDDTHHmmSS') + prompt);
  
    url += `text=${text}&`
    if (details != 'false') {
      url += `details=${details}&`
    }
    if (location != 'false') {
      url += `location=${location}&`
    }
    url += `dates=${startDate}Z/${endDate}Z&`
    return url;
  }