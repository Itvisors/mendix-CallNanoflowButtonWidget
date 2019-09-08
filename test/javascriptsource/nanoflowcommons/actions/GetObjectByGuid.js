// This file was generated by Mendix Studio Pro.
//
// WARNING: Only the following code will be retained when actions are regenerated:
// - the code between BEGIN USER CODE and END USER CODE
// Other code you write will be lost the next time you deploy the project.

/**
 * @param {string} entity - This field is required.
 * @param {string} objectGuid - This field is required.
 * @returns {MxObject}
 */
function GetObjectByGuid(entity, objectGuid) {
	// BEGIN USER CODE
  if (!entity) {
    throw new TypeError("Input parameter 'Entity' is required.");
  }
  if (!objectGuid) {
    throw new TypeError("Input parameter 'Object guid' is required.");
  }
  return new Promise(function (resolve, reject) {
    mx.data.get({
      guid: objectGuid,
      callback: function callback(object) {
        if (object) {
          resolve(object);
        } else
        {
          reject();
        }
      } });

  });
	// END USER CODE
}