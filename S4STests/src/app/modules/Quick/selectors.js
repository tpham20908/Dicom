export const Selectors = {
  buttons: {
    add_package: ".btn.btn-md.btn-secondary.inline",
    restart_shipment: ".dicon-redo",
    add_package: "button[data-for=addpackage]",
    ship: ".quick-shipment-ship-button"
  },
  divs: {
    quick_container: ".quick-shipment",
    quick_selector: "div.side-bar > div.menu-item.hover-over.shipping > span > div.sub-routes > div:nth-child(3)",
    shipping_sidebar: "div.side-bar > div.menu-item.hover-over.shipping",
    contact: ".contact-entry-item",
    from_selected: ".address-bubble.active",
    to_selected: ".address-bubble.orange-active"
  },
  inputs: {
    from_contact: ".address.shipper .form-group input[name=contact]",
    to_contact: ".address.recipient .form-group input[name=contact]",
    quantity: "input[name=quantity]",
    weight: "input[label=Weight]",
    length: "input[name=length]",
    width: "input[name=width]",
    height: "input[name=height]",
    instruction: "input[name=instructions]",
    department: "input[label=Department]",
    employee_number: "input[label=EMP]",
    invoice_number: "input[label=INV]",
    purchase_order_number: "input[label=PON]",
    presold_order_reference: "input[label=PRE]",

    //REFERNCES:
    employee: ".kv-inputs div:nth-child(1) input:nth-child(2)",
    invoice: ".kv-inputs div:nth-child(2) input:nth-child(2)",
    purchase_order: ".kv-inputs div:nth-child(3) input:nth-child(2)",
    pre_sold_order: ".kv-inputs div:nth-child(4) input:nth-child(2)",

  },
  selects: {
    billing_account: "select[name=billing_account]",
    payment: "select[name=payment_type]",
    package_type: ".package-options select[name=type]",
    pickup_ready: "select[name=pickup_ready_by]",
    pickup_closing: "select[name=pickup_closing_time]",
    pickup_point: "select[name=pickup_point]",
    service_type: "select[name=service_type]"
  }
}