const fs = require('fs');

let content;
let addresses;
let payment;
let boxShipment;
let envelopeShipment;
let pickupDetails;
let references;
let additionalServices;

fs.readFile('../inputShipments/CA_DOM_Parcel_112.txt', function read(err, data) {
  if (err) {
    throw err;
  }
  content = data;
  processFile();
});

function processFile() {
  let res = JSON.parse(content);
  addresses = {
    from: res.addresses.from,
    to: res.addresses.to
  };
  payment = {
    type: res.payment.type,
    account: res.payment.account
  };
  boxShipment = {
    packageType: res.boxShipment.packageType,
    quantity: res.boxShipment.quantity,
    weight: res.boxShipment.weight,
    length: res.boxShipment.length,
    width: res.boxShipment.width,
    height: res.boxShipment.height,
    instruction: res.boxShipment.instruction
  };
  envelopeShipment = {
    packageType: res.envelopeShipment.packageType,
    quantity: res.envelopeShipment.quantity,
    instruction: res.envelopeShipment.instruction
  };
  pickupDetails = {
    service: res.pickupDetails.service,
    ready: res.pickupDetails.ready,
    closing: res.pickupDetails.closing,
    department: res.pickupDetails.department,
    point: res.pickupDetails.point
  }
  references = {
    employeeNumber: res.references.employeeNumber,
    invoiceNumber: res.references.invoiceNumber,
    purchaseNumber: res.references.purchaseNumber,
    presoldOrderNumber: res.references.presoldOrderNumber
  };

  additionalServices = {
    holdForPickup: res.additionalServices.holdForPickup,
    nonConveyable: res.additionalServices.nonConveyable,
    privateHomeDelivery: res.additionalServices.privateHomeDelivery,
    signatureRequired: res.additionalServices.signatureRequired,
    tradeShowDelivery: res.additionalServices.tradeShowDelivery,
    weekendDelivery: res.additionalServices.weekendDelivery,
    insurance: res.additionalServices.insurance,
    insuranceValue: res.additionalServices.insuranceValue
  };

  console.log(addresses);
  console.log(payment);
  console.log(boxShipment);
  console.log(envelopeShipment);
  console.log(pickupDetails);
  console.log(references);
  console.log(additionalServices);
}