
exports.closePosition = async (positionInfo, sessionInfo) => {

    let requestOptions = {
      method: 'DELETE',
      headers: {
        "X-SECURITY-TOKEN": sessionInfo.securityToken,
        "CST": sessionInfo.cst
      },
      redirect: 'follow'
    };

    const closedPosition = await fetch(`https://api-capital.backend-capital.com/api/v1/positions/${positionInfo.dealId}`, requestOptions)
      .then(response => response.text())
      .then(result =>  {return result})
      .catch(error =>  {return error});
  
    console.log(closedPosition)
  
    return closedPosition;
  }