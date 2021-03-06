let shipmentOutput = {
  AccountID: "300030",
  ManifestNumber: "",
  ManifestDate: "",
  Instruction1: "dgsfgsfs",
  RateType: "regular",
  ShipmentDate: "2018-09-25T17:07:31.241Z",
  ShipmentType: "GRD",
  Waybill: "W00191623",
  FromAddress: "10500 Avenue Ryan",
  FromStreetNumber: "10500",
  FromCity: "Dorval",
  FromProvince: "QC",
  FromPostal: "H9P 2T7",
  ToName: "CAM-TRAC BERNIERES INC.",
  ToCustID: "47301",
  ToDicomAccountNo: "",
  Contact: "CAM-TRAC BERNIERES INC.",
  ConsigneeOfficeNumber: "(905) 738-2048",
  ToAddress: "348 Bronte",
  ToCity: "SAINT-NICOLAS",
  ToPostal: "G7A 2N1",
  ToProvince: "QC",
  ToStreetNumber: "348",
  NbPiece: "",
  Weight: "",
  AdditionalServices: "",
  Email: "",
  Invoice: "2",
  BaseAmount: "18.35",
  Preferences: "",
  Taxes: "4.09",
  ShipSubTotal: "24.1",
  Total: "31.4"
};

let shipmentInput = {
  from: "Dicom Shipping Test",
  to: "CAM-TRAC",
  payment: PAYMENT_TYPES.prepaid,
  account: ACCOUNTS.ca_parcel,
  service: SERVICE_TYPES.ground,
  ready: PICKUP_TIMES.eight,
  closing: PICKUP_TIMES.four_thirty,
  point: PICKUP_POINTS.mailbox,
  employee_number: "", 
  invoice_number: "", 
  purchase_order_number: "", 
  presold_order_reference: "",
  pkgType: "",  // EV or BX
  quantity: "", 
  weight: "", 
  length: "", 
  width: "", 
  height: "", 
  instruction: "", 
  pickup_ready: "", 
  pickup_closing: "", 
  pickup_point: "", 
  department: "", 
}