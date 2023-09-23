

exports.createBuyPosition = async (sessionInfo, epic) => {

    let raw = JSON.stringify({
        "epic": epic,
        "direction": 'BUY',
        "size": 0.01,
    });

    let requestOptions = {
      method: 'POST',
      headers: {
        "X-SECURITY-TOKEN": sessionInfo.securityToken,
        "CST": sessionInfo.cst,
        "Content-Type": "application/json"
      },
      body: raw,
      redirect: 'follow'
    };

    let requestOptions2 = {
        method: 'GET',
        headers: {
          "X-SECURITY-TOKEN": sessionInfo.securityToken,
          "CST": sessionInfo.cst
        },
        redirect: 'follow'
      };
  
    const position = await fetch("https://api-capital.backend-capital.com/api/v1/positions", requestOptions)
      .then(response => response.text())
      .then(result =>  {return result})
      .catch(error =>  {return error});
  
    const dealReference = JSON.parse(position).dealReference;
  
    const confirmation = await fetch(`https://api-capital.backend-capital.com/api/v1/confirms/${dealReference}`, requestOptions2)
      .then(response => response.text())
      .then(result => {return result})
      .catch(error => {return error});
  
    return 'Deal Reference:', JSON.parse(position).dealReference, confirmation;
  }