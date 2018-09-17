export const Selectors = {
  buttons: {
    add_package: ".btn.btn-md.btn-secondary.inline",
    restart_shipment: ".dicon-redo",
  },
  divs: {
    quick_container: ".quick-shipment",
    quick_selector: "div.side-bar > div.menu-item.hover-over.shipping > span > div.sub-routes > div:nth-child(3)",
    shipping_sidebar: "div.side-bar > div.menu-item.hover-over.shipping",
  },
  inputs: {
    from_contact: "#shipper_contact .form-group.std input[name=contact]",
    to_contact: "#shipper_contact .form-group.std input[name=contact]",
    billing_account: ".input.right .form-group.std select[name=billing_account]",
    payment: ".input.left .form-group.std select[name=payment_type]",

    //REFERNCES:
    employee: ".kv-inputs div:nth-child(1) input:nth-child(2)",
    invoice: ".kv-inputs div:nth-child(2) input:nth-child(2)",
    purchase_order: ".kv-inputs div:nth-child(3) input:nth-child(2)",
    pre_sold_order: ".kv-inputs div:nth-child(4) input:nth-child(2)",

  },
}