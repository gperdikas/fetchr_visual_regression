function validateIssues (issueArray) {
  if (!Array.isArray(issueArray)) {
    throw new Error("Input is not an array"); 
  }

  for (let i=0; i<issueArray.length; i++) {
    if (issueArray[i].severity === "") {
      throw new Error("Given severity is empty");
    }
 
    if (issueArray[i].title === "") {
      throw new Error("Given title is empty");
    }
 
    if (issueArray[i].description === "") {
      throw new Error("Given description is empty");
    }

    if (typeof issueArray[i].severity === 'undefined') {
      throw new Error("Given severity is undefined");
    }

    if (typeof issueArray[i].title === 'undefined') {
      throw new Error("Given title is undefined");
    }

    if (typeof issueArray[i].description === 'undefined') {
      throw new Error("Given description is undefined");
    }

    if (issueArray[i].severity !== 'Critical' || 'Major' || 'Minor') {
      throw new Error("Invalid severity. Must be 'Critical', 'Major' or 'Minor'");
    }

  }
}
module.exports = {validateIssues};
