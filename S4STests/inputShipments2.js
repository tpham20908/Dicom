const fs = require('fs');

let content;
let addresses;
let payment;
let boxShipment;
let envelopeShipment;
let pickupDetails;
let references;
let additionalServices = {
  holdForPickup: false,
  nonConveyable: false,
  privateHomeDelivery: false,
  signatureRequired: false,
  tradeShowDelivery: false,
  weekendDelivery: false,
  insurance: false,
};

fs.readFile('../inputShipments/CA_DOM_Parcel_113.txt', function read(err, data) {
  if (err) {
    throw err;
  }
  content = data;
  processFile();
});

function processFile() {
  let res = JSON.parse(content);

  let addServicesObj = res.AdditionalServices.split(" ");

  addServicesObj.map(s => {
    let key = s.split(":")[0];
    let value = s.split(":")[1];
    if (key === "HFP")  additionalServices.holdForPickup = value;
    if (key === "NCV")  additionalServices.nonConveyable = value;
    if (key === "PHD")  additionalServices.privateHomeDelivery = value;
    if (key === "PHS")  additionalServices.signatureRequired = value;
    if (key === "TRD")  additionalServices.tradeShowDelivery = value;
    if (key === "WKD")  additionalServices.weekendDelivery = value;
    if (key === "DCV") {
      additionalServices.insurance = true;
      additionalServices.insuranceValue = value;
    }
  });

  addresses = {
    from: res.FromAddress + " " + res.FromCity + " " + res.FromProvince,
    to: res.ToName
  }
  payment = {
    type: "PREPAID",
    account: res.AccountID
  }
  boxShipment = {
    packageType: "BX",
    quantity: res.NbPiece.split(" ")[0],
    weight: res.Weight.split(" ")[0],
    length: res.Length.split(" ")[0],
    width:  res.Width.split(" ")[0],
    height: res.Height.split(" ")[0],
    instruction: res.Instruction1
  };
  envelopeShipment = {
    packageType: "EV",
    quantity: res.NbPiece.split(" ")[1],
    instruction: ""
  };
  pickupDetails = {
    service: res.ShipmentType,
    ready: "16:00",
    closing: "18:00",
    department: res.Department,
    point: "MB"
  }
  references = {
    employeeNumber: "4",
    invoiceNumber: res.Invoice,
    purchaseNumber: res.PurchaseOrderNumber,
    presoldOrderNumber: "1"
  };

  console.log(addresses);
  console.log(payment);
  console.log(boxShipment);
  console.log(envelopeShipment);
  console.log(pickupDetails);
  console.log(references);
  console.log(additionalServices);
}